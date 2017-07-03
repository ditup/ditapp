import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { User } from '../../shared/types';

@Component({
  selector: 'app-user-edit-location',
  templateUrl: './user-edit-location.component.html',
  styleUrls: ['./user-edit-location.component.scss']
})
export class UserEditLocationComponent implements OnInit {

  public user: User;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.parent.data.subscribe(({ user }: { user: User }) => {
      this.user = user;
    });
  }

  public get updateLocation() {
    return (async function (location: [number, number]) {
      const updatedUser = await this.model.updateUser(this.user.username, { location });
      this.user.preciseLocation = updatedUser.preciseLocation;
      this.user.location = updatedUser.location;
    }).bind(this);
  }

}
