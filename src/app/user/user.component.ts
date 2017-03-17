import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { MdDialog } from '@angular/material';

import { ModelService } from '../model.service';
import { AuthService } from '../auth.service';
import { UserTag } from '../shared/types';

import { UserTagDetailComponent } from '../shared/user-tag-detail/user-tag-detail.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  public username: string;
  public user: any;
  public exists: boolean;
  public isMe: boolean;
  public userTags: UserTag[];
  public avatar: { base64: string, format: string };


  constructor(private model: ModelService,
              private route: ActivatedRoute,
              private auth: AuthService,
              private dialog: MdDialog
             ) { }

  ngOnInit() {
    // fetch the username from url params
    this.route.params
      .subscribe(async (params: Params) => {
        const username = params['username'];

        try {
          // read user from database
          const user = await this.model.readUser(username);

          // assign variables
          this.exists = true;
          this.username = user.username;
          this.user = user;
          this.isMe = (this.username === this.auth.username) ? true : false;

          // get avatar and assign it to this.avatar
          const avatarPromise = this.model.readAvatar(username)
            .then(data => {
              this.avatar = data;
            });

          // get user-tags and assign them to this.userTags;
          const userTagsPromise = this.model.readUserTags(username)
            .then((userTags: UserTag[]) => {
              this.userTags = userTags;
            });

          await Promise.all([userTagsPromise, avatarPromise]);

        } catch (err) {
          this.exists = false;
          console.log(err);
        }

      });
  }

  public openTagDetail(userTag: UserTag) {
    const dialogRef = this.dialog.open(UserTagDetailComponent);

    // provide the closing function
    dialogRef.componentInstance.ref = dialogRef;

    // initialize the tag
    dialogRef.componentInstance.userTag = userTag;
  }

}
