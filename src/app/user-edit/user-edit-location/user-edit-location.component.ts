import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { User } from '../../shared/types';
import { ModelService } from '../../model.service';
import { NotificationsService } from '../../notifications/notifications.service';

@Component({
  selector: 'app-user-edit-location',
  templateUrl: './user-edit-location.component.html',
  styleUrls: ['./user-edit-location.component.scss']
})
export class UserEditLocationComponent implements OnInit {

  public user: User;

  public isSelectLocationDisabled = false;

  constructor(private route: ActivatedRoute, private model: ModelService, private notify: NotificationsService) { }

  ngOnInit() {
    this.route.parent.data.subscribe(({ user }: { user: User }) => {
      this.user = user;
    });
  }

  /**
   * Save or remove the location.
   */
  async updateLocation(location: [number, number]|null) {
    this.isSelectLocationDisabled = true;

    const updatedUser = await this.model.updateUser(this.user.username, { location });
    this.user.preciseLocation = updatedUser.preciseLocation;
    this.user.location = updatedUser.location;

    this.isSelectLocationDisabled = false;

    // notify about success
    const savedOrRemoved = (location) ? 'saved' : 'removed';
    this.notify.info(`Your location was ${savedOrRemoved}.`);
  }
}
