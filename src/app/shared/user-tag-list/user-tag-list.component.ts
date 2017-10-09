import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { UserTag } from '../types';
import { UserTagDetailComponent } from '../user-tag-detail/user-tag-detail.component';

@Component({
  selector: 'app-user-tag-list',
  templateUrl: './user-tag-list.component.html',
  styleUrls: ['./user-tag-list.component.scss']
})
export class UserTagListComponent implements OnInit {
  @Input()
  public userTags: UserTag[];

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  public openTagDetail(userTag: UserTag) {
    const dialogRef = this.dialog.open(UserTagDetailComponent);

    // provide the closing function
    dialogRef.componentInstance.ref = dialogRef;

    // initialize the tag
    dialogRef.componentInstance.userTag = userTag;
  }

}
