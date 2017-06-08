import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { User } from '../shared/types';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

  public user: User;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data
      .subscribe(({ user }: { user: User }) => {
        this.user = user;
      });
  }
}
