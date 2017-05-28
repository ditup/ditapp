import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ModelService } from '../../model.service';
import { AuthService } from '../../auth.service';
import { UserTag, User } from '../../shared/types';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public username: string;
  public user: User;
  public isMe: boolean;
  public userTags: UserTag[];

  constructor(private model: ModelService,
              private route: ActivatedRoute,
              private auth: AuthService,
             ) { }

  ngOnInit() {

    this.route.data
      .subscribe(async ({ user }: { user: User }) => {
        this.username = user.username;
        this.user = user;
        this.isMe = this.username === this.auth.username;

        // get user-tags and assign them to this.userTags;
        this.userTags = await this.model.readUserTags(this.username);

      });
  }
}
