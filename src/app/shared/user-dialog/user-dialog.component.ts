import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { UserTag } from '../types';
import { User } from 'app/models/user';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent implements OnInit {

  @Input() user: User;
  @Input() userTags: UserTag[];
  public ref: MatDialogRef<UserDialogComponent>;

  constructor() { }

  ngOnInit() {
  }

  close() {
    if (this.ref) {
      this.ref.close();
    }
  }

}
