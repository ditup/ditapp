import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MdDialog, MdDialogRef } from '@angular/material';

import * as _ from 'lodash';

import { polyfill } from 'mobile-drag-drop';

import { TagStoryFormComponent } from './tag-story-form/tag-story-form.component';
import { TagRemoveConfirmComponent } from './tag-remove-confirm/tag-remove-confirm.component';

import { ModelService } from '../../model.service';
import { NotificationsService } from '../../notifications/notifications.service';

import { Tag, UserTag, User } from '../../shared/types';

@Component({
  selector: 'app-user-edit-tags',
  templateUrl: './user-edit-tags.component.html',
  styleUrls: ['./user-edit-tags.component.scss']
})
export class UserEditTagsComponent implements OnInit {

  public user: User;

  public tagStoryDialogRef: MdDialogRef<TagStoryFormComponent>;
  public removeTagDialogRef: MdDialogRef<TagRemoveConfirmComponent>;

  // lists of tags, by relevance
  // 1-5 tags by relevance
  // 0 newly added tags (default relevance = 3)
  tagLists: UserTag[][] = [[], [], [], [], [], []];

  constructor(private model: ModelService,
              private route: ActivatedRoute,
              private dialog: MdDialog,
              private notify: NotificationsService) {
                polyfill({});
              }

  ngOnInit() {
    this.route.parent.data.subscribe(({ user }: { user: User }) => {
      this.user = user;
    });

    this.route.data.subscribe(({ userTags }: { userTags: UserTag[] }) => {
      // sort tags into their tagList by relevance
      for (const tag of userTags) {
        this.tagLists[tag.relevance].push(tag);
      }
    });
  }

  get tags(): UserTag[] {
    // join the tagLists to a single list
    return [].concat(...this.tagLists);
  }

  // prevent default events to make drag & drop work on touch devices with `mobile-drag-drop` library
  public preventDefault(event) {
    event.mouseEvent.preventDefault();
    return false;
  }

  // this function opens a dialog to update user-tag story
  openTagStoryDialog(tag: UserTag) {
    // open the dialog
    this.tagStoryDialogRef = this.dialog.open(TagStoryFormComponent);
    const dialogRef = this.tagStoryDialogRef;

    // a function to call when the dialog form is submitted
    dialogRef.componentInstance.processForm = this.updateTagStory.bind(this);

    // initialize the dialog with the provided tag
    dialogRef.componentInstance.userTag = tag;
  }

  // provided the data we update the current user's tag story in database
  // at the end we close the dialog.
  async updateTagStory({ tagname, story }: { tagname: string, story: string }): Promise<void> {
    // update user-tag in database (send XHR to REST API)
    await this.model.updateUserTag(this.user.username, tagname, { story });
    // we succeeded.

    // update the story in the tag object of this component
    // find the tag by tagname and update its story
    const tag = _.find(this.tags, (userTag: UserTag) => {
      return userTag.tag.tagname === tagname;
    });

    tag.story = story;

    // close the dialog
    if (this.tagStoryDialogRef) {
      this.tagStoryDialogRef.close();
    }

    this.notify.info('Your tag story was updated.');
  }

  public async addTag({ tagname }: Tag): Promise<void> {
    const { username } = this.user;
    try {
      console.log('adding tag to', username, tagname);
      const newTag: UserTag = await this.model.addTagToUser({ username, tagname, relevance: 3, story: ''});

      // add to the tag lists
      this.tagLists[0].push(newTag);

    } catch (e) {
      switch (e.status) {
        case 404:
          this.notify.error(`The tag ${tagname} doesn't exist.`);
          break;
        case 409:
          this.notify.error(`The tag ${tagname} was already added to you.`);
          break;
        default:
          this.notify.error(`An unexpected error. ${e.message}`);
      }

    }
  }

  // this function opens a dialog to confirm removing userTag
  openRemoveTagDialog(userTag: UserTag) {
    // open the dialog
    this.removeTagDialogRef = this.dialog.open(TagRemoveConfirmComponent);
    const dialogRef = this.removeTagDialogRef;

    const component = dialogRef.componentInstance;

    // initialize the dialog with the provided tag
    component.userTag = userTag;

    // subscribe to dialog confirmation
    const subscription: any = component.onConfirm.subscribe(async (userTagConfirmed: UserTag) => {
      console.log('confirming tag deletion');
      await dialogRef.close();
      await this.removeTag(userTagConfirmed.tag.tagname);
      subscription.unsubscribe();
    });

  }

  async removeTag(tagname: string) {

    // @TODO make the state of adding and removing a tag visible
    // i.e. change color of the tag which is removed
    // add the tag immediately with different color. when saved, make the color normal
    const { username } = this.user;

    await this.model.removeUserTag(username, tagname)
    console.log('tag successfully removed');
    this.tagLists.forEach((list) => {
      _.pullAllBy(list, [{ tag: { tagname } }], 'tag.tagname');
    });
  }

  // what to do when a tag is dropped to a new relevance
  async dropTagToRelevance({ from, userTag }: { from: number, userTag: UserTag }, to: number) {
    const { username } = this.user;
    const { tagname } = userTag.tag;

    // check if the relevance is new
    if (from === to) {
      return;
    }

    // add the tag to the new relevance
    this.tagLists[to].push(userTag);
    // disable the tag while moving
    userTag['disabled'] = true;

    try {
      await this.model.updateUserTag(username, tagname, { relevance: to });

      // change the relevance of the tag object
      userTag.relevance = to;
      // remove the tag from the old relevance
      _.pull(this.tagLists[from], userTag);
    } catch (e) {
      console.error(e);
      // remove the tag from the new relevance
      _.pull(this.tagLists[to], userTag);

      // notify about the error
      this.notify.error(`Changing relevance of ${tagname} failed.`);
    } finally {
      // enable the tag again
      delete userTag['disabled'];
    }
  }

  async createAddTag({ tagname }: Tag): Promise<void> {
    // create the tag, then add it to the user
    await this.model.createTag({ tagname });
    await this.addTag({ tagname });
  }

}
