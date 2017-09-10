import { Component, Input, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';

import { User, UserTag } from '../types';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent implements OnInit {

  @Input() user: User;
  @Input() userTags: UserTag[];
  public ref: MdDialogRef<UserDialogComponent>;

  constructor() { }

  ngOnInit() {
  }

  close() {
    if (this.ref) {
      this.ref.close();
    }
  }

}
