import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MdSnackBar, MdDialog, MdDialogRef } from '@angular/material';

import { Observable } from 'rxjs/Observable';

import * as _ from 'lodash';

import { TagsNewFormComponent } from '../../shared/tags-new-form/tags-new-form.component';

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

  // a list of tags for autosuggest
  public suggestedTags: Observable<Tag[]>;

  public dialogRef: MdDialogRef<TagsNewFormComponent>;

  addTagForm: FormGroup;

  // lists of tags, by relevance
  // 1-5 tags by relevance
  // 0 newly added tags (default relevance = 3)
  tagLists: any[][] = [[],[],[],[],[],[]];

  constructor(private formBuilder: FormBuilder,
              private model: ModelService,
              private snackBar: MdSnackBar,
              private dialog: MdDialog) { }

  ngOnInit() {
    this.buildForm();
    this.model.readUserTags(this.username)
      .then(tags => {
        this.tags = tags;

        // sort tags into their tagList by relevance
        for(let tag of tags) {
          this.tagLists[tag.relevance].push(tag);
        }
      });

    this.addTagForm.controls['tagname'].valueChanges
      .debounceTime(400)
      .startWith(null)
      .subscribe(val => {
        this.suggestedTags = this.model.readTagsLike(val);
      });
  }

  private buildForm(): void {
    this.addTagForm = this.formBuilder.group({
      tagname: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(64),
        Validators.pattern(/^[a-z0-9]+(\-[a-z0-9]+)*$/)
      ]]
    });
  }

  // adding a new tag
  onSubmit() {
    console.log('adding tag:', this.addTagForm.value);

    const tagname = this.addTagForm.value.tagname;

    this.addTagOfferNew(tagname);
  }

  // add existent tag
  // open dialog to create non-existent tag
  addTagOfferNew(tagname) {
    const username = this.username;

    this.addTag(username, tagname)
      .catch(e => {
        console.log(e.json());

        const resp = e.json();

        this.addTagForm.reset();

        switch (e.status){
          case 404:
            this.openDialog(tagname);
            break;
          case 409:
            this.snackBar.open(`The tag ${tagname} was already added to you`, 'OK');
            break;
          default:
            this.snackBar.open(`An Unexpected Error. ${resp.toString()}`, 'OK');
        }
      });
  }

  addTagFromAutosuggestion(tagname) {
    this.addTag(this.username, tagname);
  }

  // used in autocomplete
  getTagname(tag: { tagname: string }): string {
    return tag.tagname;
  }

  addTag(username: string, tagname: string): Promise<void> {
    return this.model.addTagToUser({ username, tagname, relevance: 3, story: ''})
      .then(newTag => {
        // add to the tag lists
        this.tagLists[0].push(newTag);

        this.addTagForm.reset();
      });
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

    this.model.updateUserTag(username, tagname, { relevance: to })
      .then(() => {
        console.log(`moved tag ${tagname} from relevance ${from} to ${to}`);
        // remove the tag from the old relevance
        _.pull(this.tagLists[from], tag);
      })
      .catch((e) => {
        console.error(e);
        // remove the tag from the new relevance
        _.pull(this.tagLists[to], tag);

        // snackbar info
        this.snackBar.open(`changing relevance of ${tagname} failed`);
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
        return this.addTag(this.username, tagname);
      })
      .then(() => {
        this.dialogRef.close();
      });
  }

}
