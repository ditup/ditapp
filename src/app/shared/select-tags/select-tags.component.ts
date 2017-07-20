/* import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { MdSnackBar, MdDialog, MdDialogRef } from '@angular/material';

import * as _ from 'lodash';

import { ModelService } from '../../model.service';
import { AuthService } from '../../auth.service';

import { SelectFromMyTagsComponent } from '../../shared/select-from-my-tags/select-from-my-tags.component';
*/

import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { TagList, Tag } from '../../shared/types';

@Component({
  selector: 'app-select-tags',
  templateUrl: './select-tags.component.html',
  styleUrls: ['./select-tags.component.scss']
})
export class SelectTagsComponent implements OnInit {

  public tagList = new TagList();

  @Output()
  public onSelected = new EventEmitter<Tag[]>();

  constructor() {}

  ngOnInit() {
  }

  public addTagToList({ tagname }: Tag) {
    try {
      // add tag to list
      this.tagList.add(tagname);
      this.emitSelection();
    } catch (e) {
      // TODO notify
    }
  }

  public removeTagFromList({ tagname }: Tag) {
    try {
      this.tagList.remove(tagname);
      // send info to Output
      this.emitSelection();
    } catch (e) {
      // TODO notify
    }
  }

  public clearSelection() {
    this.tagList.tags = [];
    // send info to Output
    this.emitSelection();
  }

  private emitSelection() {
    this.onSelected.emit(this.tagList.tags);
  }

/*
  @Input()
  public inputTags: Tag[];

  public userList = new UserList([]);

  private myTagsDialog: MdDialogRef<SelectFromMyTagsComponent>;

  // showing a progress bar when users loading is in progress
  public loadingUsers = false;

  constructor(private snackBar: MdSnackBar,
              private auth: AuthService,
              private model: ModelService,
              private dialog: MdDialog) { }


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

  public complainNonexistentTag ({ tagname }: Tag) {
    this.snackBar.open(`tag ${tagname} doesn't exist`, 'OK');
  }


  private async addTagsToList(tagnames: string[]) {

    if (tagnames.length === 0) {
      return;
    }

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
*/
}
