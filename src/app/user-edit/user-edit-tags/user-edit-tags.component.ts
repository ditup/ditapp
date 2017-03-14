import { Component, OnInit, Input } from '@angular/core';

import { MdSnackBar, MdDialog, MdDialogRef } from '@angular/material';

import { Observable } from 'rxjs/Observable';

import * as _ from 'lodash';

import { TagsNewFormComponent } from '../../shared/tags-new-form/tags-new-form.component';
import { TagStoryFormComponent } from './tag-story-form/tag-story-form.component';

import { ModelService } from '../../model.service';

class Tag {
  constructor(public tagname: string, public description: string) {}
}

class UserTag {
  constructor(public tagname: string,
              public story: string,
              public relevance: number) {}
}

@Component({
  selector: 'app-user-edit-tags',
  templateUrl: './user-edit-tags.component.html',
  styleUrls: ['./user-edit-tags.component.scss']
})
export class UserEditTagsComponent implements OnInit {

  @Input() username: string;

  public tags: UserTag[];

  public dialogRef: MdDialogRef<TagsNewFormComponent>;

  public tagStoryDialogRef: MdDialogRef<TagStoryFormComponent>;

  // lists of tags, by relevance
  // 1-5 tags by relevance
  // 0 newly added tags (default relevance = 3)
  tagLists: any[][] = [[],[],[],[],[],[]];

  constructor(private model: ModelService,
              private snackBar: MdSnackBar,
              private dialog: MdDialog) { }

  ngOnInit() {
    this.model.readUserTags(this.username)
      .then(tags => {
        this.tags = tags;

        // sort tags into their tagList by relevance
        for(let tag of tags) {
          this.tagLists[tag.relevance].push(tag);
        }
      });
  }

  // this function opens a dialog to update user-tag story
  openTagStoryDialog(tag: UserTag) {
    // open the dialog
    this.tagStoryDialogRef = this.dialog.open(TagStoryFormComponent);
    const dialogRef = this.tagStoryDialogRef;

    // a function to call when the dialog form is submitted
    dialogRef.componentInstance.processForm = this.updateTagStory.bind(this);

    // initialize the dialog with the provided tag
    dialogRef.componentInstance.init(tag);
  }

  // provided the data we update the current user's tag story in database
  // at the end we close the dialog.
  updateTagStory({ tagname, story }: { tagname: string, story: string }): Promise<void> {
    // update user-tag in database (send XHR to REST API)
    return this.model.updateUserTag(this.username, tagname, { story })
      .then(() => {
        // we succeeded.

        // update the story in the tag object of this component
        // find the tag by tagname and update its story
        const tag = _.find(_.concat.apply(this, this.tagLists), (tag: { tagname: string, story: string }) => {
          return tag.tagname === tagname;
        });
        tag.story = story;

        // close the dialog
        this.tagStoryDialogRef.close();
      });
  }

  public async addTag(tagname: string): Promise<void> {
    const username: string = this.username;
    try {
      console.log('adding tag to', username, tagname);
      const newTag = await this.model.addTagToUser({ username, tagname, relevance: 3, story: ''});

      // add to the tag lists
      this.tagLists[0].push(newTag);

    } catch (e) {

      console.log(e.json());

      const resp = e.json();

      switch (e.status) {
        case 404:
          this.snackBar.open(`The tag ${tagname} doesn't exist`, 'OK');
          break;
        case 409:
          this.snackBar.open(`The tag ${tagname} was already added to you`, 'OK');
          break;
        default:
          this.snackBar.open(`An Unexpected Error. ${resp.toString()}`, 'OK');
      }

    }
  }

  removeTag(tagname: string) {

    // @TODO make the state of adding and removing a tag visible
    // i.e. change color of the tag which is removed
    // add the tag immediately with different color. when saved, make the color normal
    console.log('removing tag', tagname);
    const username = this.username;

    this.model.removeUserTag(username, tagname)
      .then(() => {
        console.log('tag successfully removed');
        _.forEach(this.tagLists, (list) => {
          _.pullAllBy(list, [{ tagname }], 'tagname');
        })
      });
  }

  // what to do when a tag is dropped to a new relevance
  dropTagToRelevance(evt: any, to: number) {
    const from: number = evt.dragData.from;
    const tag = evt.dragData.data;

    const username = this.username;
    const tagname = tag.tagname;

    // check if the relevance is new
    if (from === to) return;

    // add the tag to the new relevance
    this.tagLists[to].push(tag);
    // disable the tag while moving
    tag.disabled = true;

    this.model.updateUserTag(username, tagname, { relevance: to })
      .then(() => {
        console.log(`moved tag ${tagname} from relevance ${from} to ${to}`);

        // change the relevance of the tag object
        tag.relevance = to;
        // remove the tag from the old relevance
        _.pull(this.tagLists[from], tag);
      })
      .catch((e) => {
        console.error(e);
        // remove the tag from the new relevance
        _.pull(this.tagLists[to], tag);

        // snackbar info
        this.snackBar.open(`changing relevance of ${tagname} failed`);
      })
      .then(() => {
        // enable the tag again
        delete tag.disabled;
      });
  }

  openDialog(tagname: string) {
    this.dialogRef = this.dialog.open(TagsNewFormComponent);
    const dialogRef = this.dialogRef;
    dialogRef.componentInstance.tagname = tagname;
    dialogRef.componentInstance.onSubmit = this.createAddTag.bind(this);
    dialogRef.componentInstance.isTagnameDisabled = true;
    dialogRef.componentInstance.init({ tagname, description: '' });
  }

  createAddTag({ tagname, description }: { tagname: string, description: string }): Promise<void> {

    console.log('creating tag in model', tagname, description);
    return this.model.createTag({ tagname, description })
      .then(() => {
        console.log('submitting the tag to the user');
        return this.addTag(tagname);
      })
      .then(() => {
        this.dialogRef.close();
      });
  }

  get autocompleteAction() {
    return this.addTag.bind(this);
  }

  get autocompleteAction404() {
    return this.openDialog.bind(this);
  }

}
