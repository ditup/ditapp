import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { NotificationsService, SimpleNotificationsComponent } from 'angular2-notifications';

import { ModelService } from '../model.service';
import { AuthService } from '../auth.service';
import { HeaderControlService } from '../header-control.service';
import { User } from '../shared/types';

@Component({
  selector: 'app-login-basic',
  templateUrl: './login-basic.component.html',
  styleUrls: ['./login-basic.component.scss']
})
export class LoginBasicComponent implements OnInit, OnDestroy {

  // the form object
  public loginForm: FormGroup;

  private isFormDisabled: boolean;

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
    const credentials = this.loginForm.value as User;
    let pendingNote = this.notifications.info('authenticating', 'authentication in process');

    try {
      const user = await this.model.basicAuth(credentials);

      user.password = credentials.password;

      console.log(user);

      // log in the auth service
      this.auth.login({ method: 'basic', credentials: user});

      console.log('authenticated');
      this.notifications.remove(pendingNote.id);
      this.notifications.success('authentication successful', 'user was successfully authenticated');
      const redirectUrl = this.route.snapshot.queryParams['redirect'] || `/user/${this.auth.username}`;

      await this.router.navigate([redirectUrl]);
      this.loginForm.reset();

      console.log('logged in as', this.auth.username, this.auth.email);
      console.log('logged', this.auth.logged, 'unverified', this.auth.loggedUnverified);

      // redirect to the url provided in ?redirect=url or to default redirect


    } catch (err) {
      this.notifications.remove(pendingNote.id);
      this.notifications.error('authentication not successful', 'username or password don\'t match');
      this.loginForm.reset({
        username: credentials.username,
        password: ''
      });

    } finally {
      this.isFormDisabled = false;
    }

    // on submit, we want to send http request POST /users to the server
    // on success (201 response) we want to redirect to a page which is awaiting the email verification code
  }
}
