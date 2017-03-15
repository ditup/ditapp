import { Component, OnInit } from '@angular/core';

import { MdSnackBar } from '@angular/material';

import * as _ from 'lodash';

import { TagList, UserList } from '../shared/types';
import { ModelService } from '../model.service';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit {

  public tagList = new TagList();
  public userList = new UserList([]);

  // showing a progress bar when users loading is in progress
  public loadingUsers: boolean = false;

  constructor(private snackBar: MdSnackBar,
              private model: ModelService) { }

  ngOnInit() {
  }

  private async addTagToList(tagname: string) {

    const isAdded = this.tagList.add(tagname);

    if (isAdded) {
      this.snackBar.open(`tag ${tagname} is already in the list`, 'OK');
      return;
    }

    await this.findUsersByTagList();
  }

  public async removeTagFromList(tagname: string) {
    this.tagList.remove(tagname);
    await this.findUsersByTagList();
  }

  private async findUsersByTagList() {
    this.loadingUsers = true;
    console.log('searching for users with tags', this.tagList.tags);
    const users = await this.model.findUsersByTags(this.tagList.tagnames);

    this.userList = new UserList(users);
    this.loadingUsers = false;
  }

  private async complainNonexistentTag (tagname: string) {
    this.snackBar.open(`tag ${tagname} doesn't exist`, 'OK');
  }

  get tagAutocompleteAction() {
    return this.addTagToList.bind(this);
  }

  get tagAutocompleteAction404() {
    return this.complainNonexistentTag.bind(this);
  }

}
