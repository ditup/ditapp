import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { NotificationsService, SimpleNotificationsComponent } from 'angular2-notifications';

import { ModelService } from '../model.service';
import { AuthService } from '../auth.service';
import { HeaderControlService } from '../header-control.service';

// an object with the authorization data
class Credentials {
  constructor(public username: string, public password: string) {}
}

@Component({
  selector: 'app-login-basic',
  templateUrl: './login-basic.component.html',
  styleUrls: ['./login-basic.component.scss']
})
export class LoginBasicComponent implements OnInit, OnDestroy {

  // the form object
  loginForm: FormGroup;

  credentials = new Credentials('', '');

  // inject modules, services
  constructor(private formBuilder: FormBuilder,
              private model: ModelService,
              private notifications: NotificationsService,
              private auth: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private headerControl: HeaderControlService) { }

  // this will execute when the page is loaded
  ngOnInit(): void {
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
      username: [this.credentials.username, [
        Validators.required
      ]],
      password: [this.credentials.password, [
        Validators.required
      ]]
    });
  }

  onSubmit(): void {
    this.auth.logout();
    this.credentials = this.loginForm.value;
    let pendingNote = this.notifications.info('authenticating', 'authentication in process');

    this.model.basicAuth(this.credentials)
    .then((user: any) => {

      user.password = this.credentials.password;

      // log in the auth service
      this.auth.login({ method: 'basic', credentials: user});

      console.log('authenticated');
      this.notifications.remove(pendingNote.id);
      this.notifications.success('authentication successful', 'user was successfully authenticated');
      this.clearFields();

      console.log('logged in as', this.auth.username, this.auth.email);
      console.log('logged', this.auth.logged, 'unverified', this.auth.loggedUnverified);

      // redirect to the url provided in ?redirect=url or to default redirect

      const redirectUrl = this.route.snapshot.queryParams['redirect'] || `/user/${this.auth.username}`;

      console.log(redirectUrl);

      this.router.navigate([redirectUrl]);

    })
    .catch((err) => {
      this.notifications.remove(pendingNote.id);
      this.notifications.error('authentication not successful', 'username or password don\'t match');
      console.log(err);
      this.loginForm.patchValue({ password: '' });

      console.log('logged', this.auth.logged, 'unverified', this.auth.loggedUnverified);
    });
    // on submit, we want to send http request POST /users to the server
    // on success (201 response) we want to redirect to a page which is awaiting the email verification code
  }

  clearFields() {
    this.loginForm.setValue({ username: '', password: '' });
  }
}
