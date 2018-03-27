import { Component, OnInit/*, HostListener*/ } from '@angular/core';

// import { DialogService } from '../../dialog.service';
import { User } from 'app/models/user';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as fromRoot from 'app/reducers';

@Component({
  selector: 'app-user-edit-profile',
  templateUrl: './user-edit-profile.component.html',
  styleUrls: ['./user-edit-profile.component.scss']
})
export class UserEditProfileComponent implements OnInit {

  public pending: boolean;

  public user$: Observable<User>;

  // private profileFields = ['givenName', 'familyName', 'description'];

  constructor(private store: Store<fromRoot.State>) {
    this.user$ = this.store.pipe(select('auth', 'user'));
  }

  ngOnInit() {
  }

  onSubmit({ givenName, familyName, description }) {
    console.log('submitting', { givenName, familyName, description })
    // TODO make it to
    /*
    const updated = await this.model.updateUser(this.user.username, this.profileForm.value) as User;

    // update the user with the new values
    this.profileFields.forEach((field) => { this.user[field] = updated[field]; });

    this.notify.info('Your profile was updated.');
    */
  }

  /*
  @HostListener('window:beforeunload')
  canDeactivate(): Promise<boolean> | boolean {
    // Allow synchronous navigation (`true`) if no changes


    const isUnchanged = isEqual(pick(this.user, this.profileFields), this.profileForm.value);

    if (isUnchanged) {
      return true;
    }

    // Otherwise ask the user with the dialog service and return its
    // promise which resolves to true or false when the user decides
    return this.dialog.confirm('Discard changes?');
  }
  */

}
