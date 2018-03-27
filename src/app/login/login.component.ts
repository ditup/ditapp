import { Component, OnInit, OnDestroy } from '@angular/core';
// import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { AuthService } from '../auth.service';
// import { ModelService } from '../model.service';
import { NotificationsService } from '../notifications/notifications.service';
import { HeaderControlService } from '../header-control.service';
import { Authenticate } from 'app/models/auth';
import * as Auth from 'app/actions/auth';
import * as fromRoot from 'app/reducers/auth';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  public isFormDisabled: boolean;

  // inject modules, services
  constructor(private notify: NotificationsService,
              private auth: AuthService,
              // private model: ModelService,
              // private router: Router,
              // private route: ActivatedRoute,
              private store: Store<fromRoot.State>,
              private headerControl: HeaderControlService) { }

  // this will execute when the page is loaded
  ngOnInit(): void {
    // check whether user is logged in
    try {
      const logged = this.auth.logged;
      // notify that we logged somebody out, if we did so
      if (logged) {
        this.notify.info('The previous user was logged out.');
      }
    } finally {
      // log user out at the beginning
      this.auth.logout();
    }
    // don't display the page header
    this.headerControl.display(false);
  }

  ngOnDestroy(): void {
    // display the header again when leaving
    this.headerControl.display(true);
  }

  async onSubmit({ username, password }: Authenticate): Promise<void> {

    this.store.dispatch(new Auth.Login({ username, password }));

    /*
    this.isFormDisabled = true;
    this.auth.logout();

    try {
      const token = await this.model.getJwtToken(username, password);
      this.auth.login(token);

      this.notify.clear();
      this.notify.info('You were authenticated.');

      // redirect to the url provided in ?redirect=url or to default redirect
      const redirectUrl = this.route.snapshot.queryParams['redirect'] || '/';

      await this.router.navigate([redirectUrl]);
    } catch (err) {

      this.notify.clear();

      let message = 'Unexpected error';
      switch (err.status) {
        case 401: {
          message = 'Username or password don\'t match.';
          break;
        }
        default: {
          // TODO throw this error instead, and handle in a global error handler
          message = 'Unexpected error.';
        }
      }

      this.notify.error(message);
    } finally {
      this.isFormDisabled = false;
    }

    // */
  }
}
