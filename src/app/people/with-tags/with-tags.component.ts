import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MdSnackBar, MdDialog, MdDialogRef } from '@angular/material';

import * as _ from 'lodash';

import { TagList, UserList, UserTag, Tag } from '../../shared/types';
import { ModelService } from '../../model.service';
import { AuthService } from '../../auth.service';

import { SelectFromMyTagsComponent } from '../../shared/select-from-my-tags/select-from-my-tags.component';

@Component({
  selector: 'app-with-tags',
  templateUrl: './with-tags.component.html',
  styleUrls: ['./with-tags.component.scss']
})
export class WithTagsComponent implements OnInit, OnChanges {

  @Input()
  public inputTags: Tag[];

  @Output()
  public onChangedTags = new EventEmitter<Tag[]>();

  public tagList = new TagList();
  public userList = new UserList([]);

  private myTagsDialog: MdDialogRef<SelectFromMyTagsComponent>;

  // showing a progress bar when users loading is in progress
  public loadingUsers: boolean = false;

  constructor(private snackBar: MdSnackBar,
              private auth: AuthService,
              private model: ModelService,
              private dialog: MdDialog) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes', changes);
    // are the changes in input tags?
    if (changes['inputTags']) {
      // compare inputTags and tagList. If they differ, change tagList and search users.
      const inputTagnames: string[] = _.map(this.inputTags, (tag: Tag): string => tag.tagname);
      const currentTagnames: string[] = this.tagList.tagnames;

      const areDifferent = _.xor(inputTagnames, currentTagnames).length > 0;

      if (areDifferent) {
        // change tagList
        this.tagList.tags = this.inputTags;
        this.updateUserList();
      }
    }
    //
  }

  public async addTagToList({ tagname }: Tag) {
    try {
      // add to list
      this.tagList.add(tagname);
      // send info to Output
      this.onChangedTags.emit(this.tagList.tags);
      // search for users
      await this.updateUserList();
    } catch (e) {
      this.snackBar.open(e.message, 'OK');
    }
  }

  private async updateUserList() {

    this.loadingUsers = true;

    const users = await this.model.findUsersByTags(this.tagList.tagnames);

    this.userList = new UserList(users);

    this.loadingUsers = false;
  }

  public async removeTagFromList(tagname: string) {
    try {
      this.tagList.remove(tagname);
      // send info to Output
      this.onChangedTags.emit(this.tagList.tags);
      await this.updateUserList();
    } catch(e) {
      this.snackBar.open(e.message, 'OK');
    }
  }

  public complainNonexistentTag ({ tagname }: Tag) {
    this.snackBar.open(`tag ${tagname} doesn't exist`, 'OK');
  }


  public async clearTags() {
    this.tagList.tags = [];
    // send info to Output
    this.onChangedTags.emit(this.tagList.tags);
    // search for users
    await this.updateUserList();
  }

  private async addTagsToList(tagnames: string[]) {

    if (tagnames.length === 0) return;

    const alreadyAdded: string[] = [];
    // add tags to list
    _.each(tagnames, (tagname: string) => {
      try {
        this.tagList.add(tagname);
      } catch (e) {
        alreadyAdded.push(tagname);
      }
    });

    if (alreadyAdded.length > 0) {
      this.snackBar.open('Some tags were already added. Not to happen.', 'OK');
    }

    // send info to Output
    this.onChangedTags.emit(this.tagList.tags);
    // search for users
    await this.updateUserList();
  }

  public async openMyTagsDialog() {
    this.myTagsDialog = this.dialog.open(SelectFromMyTagsComponent);

    const dialog = this.myTagsDialog.componentInstance;

    dialog.loading = true;

    const myTags = await this.model.readUserTags(this.auth.username);

    dialog.originalSelection = this.tagList.tags;
    dialog.userTags = myTags;
    dialog.generateMyTags.call(dialog);
    dialog.loading = false;
    dialog.close = this.closeDialog.bind(this);
  }

  public async closeDialog(selectedTags) {
    this.myTagsDialog.close();
    await this.addTagsToList(_.map(selectedTags, (tag: Tag) => tag.tagname));
  }

}
