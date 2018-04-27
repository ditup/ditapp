import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/reducers';
import {  User } from 'app/models/user';
import { UserTag } from 'app/models/user-tag';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public user$: Observable<User>;
  public userTags$: Observable<UserTag[]>
  // public isMe: boolean;

  constructor(private store: Store<fromRoot.State>) {
    this.user$ = this.store.pipe(select(fromRoot.getRouteUser));
    this.userTags$ = this.store.pipe(select(fromRoot.getRouteUserTags));
  }

  ngOnInit() {
  }
}
