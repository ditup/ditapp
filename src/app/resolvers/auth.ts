import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/reducers';
import { State as Auth } from 'app/reducers/auth';
import { AuthService } from 'app/services/auth';
import * as authActions from 'app/actions/auth';

import { filter, take } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthResolver implements Resolve<any> { // TODO improve type

  constructor(private authService: AuthService, private store: Store<fromRoot.State>) { }

  resolve(): Observable<Auth> {
    this.initLogin();

    return this.waitForInitLogin();
  }

  initLogin(): void {
    const auth = this.authService.loginFromStore()
    this.store.dispatch(new authActions.InitialLoginSuccess(auth))
  }

  waitForInitLogin(): Observable<Auth> {
    return this.store.pipe(
      select('auth'),
      filter((auth: Auth) => !auth.pending),
      take(1)
    )
  }

    /*
      constructor(private apiService: ApiService, private store: Store<IAppState>) { }

  resolve(): Observable<IProfileData> {

    this.initProfileData();

    return this.waitForProfileDataToLoad();
  }

  waitForProfileDataToLoad(): Observable<IProfileData> {
    return this.store.select('profile')
      .map(store => store.profileData)
      .filter(profileData => !!profileData)
      .take(1);
  }

  initProfileData(): void {
    this.store.take(1).subscribe(store => {
      if (!store.profile.profileData) {
        this.apiService.getProfileData().toPromise().then(data => {
          this.store.dispatch(new profileActions.UpdateAction(data));
        });
      }
    });
  }
    /*
    const username = route.params['username'];
    try {
      const user = await this.model.readUser(username);
      return user;
    } catch (e) {
      return null;
    }
    */
}
