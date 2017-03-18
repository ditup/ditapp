import { Component, OnInit } from '@angular/core';

import * as _ from 'lodash';

import { UserList, UserTag, Tag } from '../../shared/types';
import { ModelService } from '../../model.service';

@Component({
  selector: 'app-with-my-tags',
  templateUrl: './with-my-tags.component.html',
  styleUrls: ['./with-my-tags.component.scss']
})
export class WithMyTagsComponent implements OnInit {
  /*
   * listing users with my tags
   */

  public userList = new UserList([]);

  // showing a progress bar when users loading is in progress
  public loadingUsers: boolean = false;

  constructor(private model: ModelService) { }

  async ngOnInit() {

    // load users with my tags
    await this.updateUserList();
  }

  private async updateUserList() {

    this.loadingUsers = true;

    const users = await this.model.findUsersByMyTags();

    this.userList = new UserList(users);
    this.loadingUsers = false;
  }

}
