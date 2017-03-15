import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';

import { UserTag } from '../types';

@Component({
  selector: 'app-user-tag-detail',
  templateUrl: './user-tag-detail.component.html',
  styleUrls: ['./user-tag-detail.component.scss']
})
export class UserTagDetailComponent implements OnInit {

  public userTag: UserTag;

  public ref: MdDialogRef<UserTagDetailComponent>;

  constructor() { }

  ngOnInit() {
  }

  // the close function should be provided
  public close(): void {
    this.ref.close();
  }

}
