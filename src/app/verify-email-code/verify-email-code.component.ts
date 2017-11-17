import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { NotificationsService } from '../notifications/notifications.service';

import { ModelService } from '../model.service';
import { AuthService } from '../auth.service';
import { HeaderControlService } from '../header-control.service';

@Component({
  selector: 'app-verify-email-code',
  templateUrl: './verify-email-code.component.html',
  styleUrls: ['./verify-email-code.component.scss']
})
export class VerifyEmailCodeComponent implements OnInit, OnDestroy {

  public verifying = true;
  public failed = false;

  // this is used to launch the after-success part of the page and hide the form
  public verificationSuccess: boolean;

  constructor(private auth: AuthService,
              private route: ActivatedRoute,
              private router: Router,
              private notify: NotificationsService,
              private model: ModelService,
              private headerControl: HeaderControlService) { }

  async ngOnInit(): Promise<void> {

    // log current user out
    this.logout();

    // hide the header
    this.headerControl.display(false);

    // verify email
    await this.verify();
  }

  ngOnDestroy(): void {
    // show the header
    this.headerControl.display(true);
  }

  /**
   * Log current user out
   */
  private logout() {
    const isLogged = this.auth.logged;
    this.auth.logout();
    // and notify about it
    if (isLogged) {
      this.notify.info('The previous user was logged out.');
    }
  }

  private async verify() {
    // fetch the username and code
    const { params } = this.route.snapshot;
    const username = params['username'];
    const code = params['code'];

    try {
      // perform the verification
      const { email, token } = await this.model.verifyEmail(username, code);
      // on success
      // inform
      this.notify.info(`your email ${email} was successfully verified`);
      // TODO login, when we get jwt token
      this.auth.login(token);
      // redirect to /home
      await this.router.navigate(['/']);
    } catch (e) {
      this.failed = true;
      // TODO better error reporting
      this.notify.error(`there was an error: ${e.message}`);
    } finally {
      this.verifying = false;
    }
  }
}
