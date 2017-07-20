import { Component, Input, OnInit } from '@angular/core';

import { User } from '../types';

@Component({
  selector: 'app-user-list-with-tags',
  templateUrl: './user-list-with-tags.component.html',
  styleUrls: ['./user-list-with-tags.component.scss']
})
export class UserListWithTagsComponent implements OnInit {

  @Input() users: User[];

  constructor() { }

  ngOnInit() {
  }

}
