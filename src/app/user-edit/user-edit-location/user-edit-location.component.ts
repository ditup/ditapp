import { Component, OnInit } from '@angular/core';

import * as userEditActions from 'app/actions/user-edit';

import { Store, select } from '@ngrx/store';

import { User } from 'app/models/user';
// import { ModelService } from '../../model.service';
// import { NotificationsService } from '../../notifications/notifications.service';
import * as fromRoot from 'app/reducers';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-user-edit-location',
  templateUrl: './user-edit-location.component.html',
  styleUrls: ['./user-edit-location.component.scss']
})
export class UserEditLocationComponent implements OnInit {

  public user$: Observable<User>;

  public isSelectLocationDisabled = false;

  constructor(private store: Store<fromRoot.State>/*, private model: ModelService, private notify: NotificationsService*/) {
    this.user$ = this.store.pipe(select(fromRoot.getAuthUser));
  }

  ngOnInit() {
  }

  async updateLocation(location: [number, number]) {
    this.store.dispatch(new userEditActions.UserEditProfile({ location }))
    /*this.isSelectLocationDisabled = true;*/

    /*
    const updatedUser = await this.model.updateUser(this.user.username, { location });
    this.user.preciseLocation = updatedUser.preciseLocation;
    this.user.location = updatedUser.location;

    this.isSelectLocationDisabled = false;

    this.notify.info('Your location was updated.');
    */
  }

}
