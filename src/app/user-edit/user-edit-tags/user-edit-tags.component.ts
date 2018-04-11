import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
// import * as _ from 'lodash';
import { polyfill } from 'mobile-drag-drop';

import { TagStoryFormComponent } from './tag-story-form/tag-story-form.component';
import { TagRemoveConfirmComponent } from './tag-remove-confirm/tag-remove-confirm.component';

// import { ModelService } from '../../model.service';
// import { NotificationsService } from '../../notifications/notifications.service';

import { UserTag } from 'app/models/user-tag';
// import { Tag } from 'app/models/tag';
import { User } from 'app/models/user';

import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as fromRoot from 'app/reducers';
import { filter, map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { UpdateUserTag, DeleteUserTag } from 'app/actions/user-edit';

@Component({
  selector: 'app-user-edit-tags',
  templateUrl: './user-edit-tags.component.html',
  styleUrls: ['./user-edit-tags.component.scss']
})
export class UserEditTagsComponent implements OnInit {

  public user$: Observable<User>;
  public userTags$: Observable<UserTag[]>;

public tagStoryDialogRef: MatDialogRef<TagStoryFormComponent>;
public removeTagDialogRef: MatDialogRef<TagRemoveConfirmComponent>;

  // lists of tags, by relevance
  // 1-5 tags by relevance
  // 0 newly added tags (default relevance = 3)
  tagLists: Observable<UserTag[]>[];

  constructor(// private model: ModelService,
              private dialog: MatDialog,
              // private notify: NotificationsService,
              private store: Store<fromRoot.State>) {
                polyfill({});
                this.user$ = this.store.pipe(select(fromRoot.getAuthUser));
                this.userTags$ = this.store.pipe(select(fromRoot.getAuthUserTags));
                this.tagLists = [
                  of([]),
                  this.userTags$.pipe(
                    filter(userTags => !!userTags),
                    map(userTags => userTags.filter(userTag => userTag.relevance === 1))
                  ),
                  this.userTags$.pipe(
                    filter(userTags => !!userTags),
                    map(userTags => userTags.filter(userTag => userTag.relevance === 2))
                  ),
                  this.userTags$.pipe(
                    filter(userTags => !!userTags),
                    map(userTags => userTags.filter(userTag => userTag.relevance === 3))
                  ),
                  this.userTags$.pipe(
                    filter(userTags => !!userTags),
                    map(userTags => userTags.filter(userTag => userTag.relevance === 4))
                  ),
                  this.userTags$.pipe(
                    filter(userTags => !!userTags),
                    map(userTags => userTags.filter(userTag => userTag.relevance === 5))
                  )
                ]
                this.userTags$.pipe(map(userTag => {
                  console.log(userTag);
                }))
              }

  ngOnInit() { }

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
  updateTagStory({ tagname: tagId, story }: { tagname: string, story: string }): void {
    this.store.dispatch(new UpdateUserTag({ tagId, story }));
    // close the dialog
    if (this.tagStoryDialogRef) {
      this.tagStoryDialogRef.close();
    }
  }

  dropTagToRelevance({ from, to, userTag: { tagId } }: { from: number, to: number, userTag: UserTag }) {
    if (from === to) return;
    this.updateTagRelevance({ tagId, relevance: to })
  }

  private updateTagRelevance({ tagId, relevance }) {
    this.store.dispatch(new UpdateUserTag({ tagId, relevance }));
    // close the dialog
    if (this.tagStoryDialogRef) {
      this.tagStoryDialogRef.close();
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
      this.removeUserTag(userTagConfirmed);
      subscription.unsubscribe();
    });
  }

  async removeUserTag(userTag: UserTag) {

    // @TODO make the state of adding and removing a tag visible
    // i.e. change color of the tag which is removed
    // add the tag immediately with different color. when saved, make the color normal

    this.store.dispatch(new DeleteUserTag(userTag));
  }

  /*
  get tags(): UserTag[] {
    // join the tagLists to a single list
    return [].concat(...this.tagLists);
  }


  public async addTag({ id: tagId }: Tag): Promise<void> {
    const { id: userId } = this.user;
    try {
      console.log('adding tag to', userId, tagId);
      const newTag: UserTag = await this.model.addTagToUser({ username: userId, tagname: tagId, relevance: 3, story: ''});

      // add to the tag lists
      this.tagLists[0].push(newTag);

    } catch (e) {
      switch (e.status) {
        case 404:
          this.notify.error(`The tag ${tagId} doesn't exist.`);
          break;
        case 409:
          this.notify.error(`The tag ${tagId} was already added to you.`);
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
      await this.removeTag(userTagConfirmed.tagId);
      subscription.unsubscribe();
    });

  }

  async removeTag(tagname: string) {

    // @TODO make the state of adding and removing a tag visible
    // i.e. change color of the tag which is removed
    // add the tag immediately with different color. when saved, make the color normal
    const { id: username } = this.user;

    await this.model.removeUserTag(username, tagname);
    console.log('tag successfully removed');
    this.tagLists.forEach((list) => {
      _.pullAllBy(list, [{ tag: { tagname } }], 'tag.tagname');
    });
  }

  // what to do when a tag is dropped to a new relevance
  async dropTagToRelevance({ from, userTag }: { from: number, userTag: UserTag }, to: number) {
    const { id: username } = this.user;
    const { tagId } = userTag;

    // check if the relevance is new
    if (from === to) {
      return;
    }

    // add the tag to the new relevance
    this.tagLists[to].push(userTag);
    // disable the tag while moving
    userTag['disabled'] = true;

    try {
      await this.model.updateUserTag(username, tagId, { relevance: to });

      // change the relevance of the tag object
      userTag.relevance = to;
      // remove the tag from the old relevance
      _.pull(this.tagLists[from], userTag);
    } catch (e) {
      console.error(e);
      // remove the tag from the new relevance
      _.pull(this.tagLists[to], userTag);

      // notify about the error
      this.notify.error(`Changing relevance of ${tagId} failed.`);
    } finally {
      // enable the tag again
      delete userTag['disabled'];
    }
  }

  async createAddTag({ id }: Tag): Promise<void> {
    // create the tag, then add it to the user
    await this.model.createTag({ id });
    await this.addTag({ id });
  }

  */

}
