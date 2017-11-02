import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from '../auth.service';
import { ModelService } from '../model.service';
import { NotificationsService } from '../notifications/notifications.service';
import { HeaderControlService } from '../header-control.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  // the form object
  public loginForm: FormGroup;

  public isFormDisabled: boolean;

  // inject modules, services
  constructor(private formBuilder: FormBuilder,
              private notify: NotificationsService,
              private auth: AuthService,
              private model: ModelService,
              private router: Router,
              private route: ActivatedRoute,
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
    // initialize the reactive form
    this.buildForm();
  }

  ngOnDestroy(): void {
    // display the header again when leaving
    this.headerControl.display(true);
  }

  buildForm(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [
        Validators.required
      ]],
      password: ['', [
        Validators.required
      ]]
    });
  }

  async onSubmit(): Promise<void> {
    this.isFormDisabled = true;
    this.auth.logout();
    const { username, password }: { username: string, password: string } = this.loginForm.value as any;

    try {
      const token = await this.model.getJwtToken(username, password);
      this.auth.login(token);

      this.notify.clear();
      this.notify.info('You were authenticated.');

      // redirect to the url provided in ?redirect=url or to default redirect
      const redirectUrl = this.route.snapshot.queryParams['redirect'] || '/';

      await this.router.navigate([redirectUrl]);
      this.loginForm.reset();

    } catch (err) {

      this.loginForm.reset({
        username,
        password: ''
      });

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

    // on submit, we want to send http request POST /users to the server
    // on success (201 response) we want to redirect to a page which is awaiting the email verification code
  }
}
