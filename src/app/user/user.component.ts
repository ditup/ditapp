import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { MdDialog } from '@angular/material';

import { ModelService } from '../model.service';
import { AuthService } from '../auth.service';

import { UserTagDetailComponent } from './user-tag-detail/user-tag-detail.component';

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
  public tags: [any];

  constructor(private model: ModelService,
              private route: ActivatedRoute,
              private auth: AuthService,
              private dialog: MdDialog
             ) { }

  ngOnInit() {
    // fetch the username from url params
    this.route.params
      .subscribe((params: Params) => {
        const username = params['username'];
        this.model.readUser(username)
        .then((user) => {
          console.log(user, 'reached ngOnInit');
          this.exists = true;
          this.username = user.username;
          this.user = user;
          this.isMe = (this.username === this.auth.username) ? true : false;
        })
        .catch((err) => {
          this.exists = false;
          console.log(err);
        });

        this.model.readUserTags(username)
        .then(tags => {
          console.log('we brought tags to profile', tags);
          this.tags = tags;
        });
      });
  }

  public openTagDetail(tag) {
    console.log(tag);
    const dialogRef = this.dialog.open(UserTagDetailComponent);

    // provide the closing function
    dialogRef.componentInstance.ref = dialogRef;

    // initialize the tag
    dialogRef.componentInstance.tag = tag;
  }

}
