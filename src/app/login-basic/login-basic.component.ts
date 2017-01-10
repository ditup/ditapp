import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

import { NotificationsService, SimpleNotificationsComponent } from 'angular2-notifications';

import { ModelService } from '../model.service';
import { BasicAuthService } from '../basic-auth.service';

// an object with the authorization data
class Auth {
  constructor(public username: string, public password: string) {}
}

@Component({
  selector: 'app-login-basic',
  templateUrl: './login-basic.component.html',
  styleUrls: ['./login-basic.component.scss']
})
export class LoginBasicComponent implements OnInit {

  // the form object
  loginForm: FormGroup;

  auth = new Auth('', '');

  // inject modules, services
  constructor(private formBuilder: FormBuilder,
              private model: ModelService,
              private notifications: NotificationsService,
              private basicAuth: BasicAuthService) { }

  // this will execute when the page is loaded
  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    this.loginForm = this.formBuilder.group({
      username: [this.auth.username, [
        Validators.required
      ]],
      password: [this.auth.password, [
        Validators.required
      ]]
    });
  }

  onSubmit(): void {
    this.basicAuth.logout();
    this.auth = this.loginForm.value;
    let pendingNote = this.notifications.info('authenticating', 'authentication in process');

    this.model.basicAuth(this.auth)
    .then((user: any) => {

      user.password = this.auth.password;

      // log in the auth service
      this.basicAuth.login(user);

      console.log('authenticated');
      this.notifications.remove(pendingNote.id);
      this.notifications.success('authentication successful', 'user was successfully authenticated');
      this.clearFields();

      console.log('logged in as', this.basicAuth.username, this.basicAuth.email);
      console.log('logged', this.basicAuth.logged, 'unverified', this.basicAuth.loggedUnverified);
    })
    .catch((err) => {
      this.notifications.remove(pendingNote.id);
      this.notifications.error('authentication not successful', 'username or password don\'t match');
      console.log(err);
      this.loginForm.patchValue({ password: '' });

      console.log('logged', this.basicAuth.logged, 'unverified', this.basicAuth.loggedUnverified);
    });
    // on submit, we want to send http request POST /users to the server
    // on success (201 response) we want to redirect to a page which is awaiting the email verification code
  }

  clearFields() {
    this.loginForm.setValue({ username: '', password: '' });
  }
}

/*
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { CustomValidators } from 'ng2-validation';

import { NewUser } from '../new-user';
// import { UniqueUsernameValidator } from '../shared/unique-username.directive';
import { ModelService } from '../model.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  // variable used for async username validator (to make debounce)
  private uniqueUsernameTimeout;

  // the data model
  user = new NewUser('', '', '');

  formErrors = {
    username: '',
    email: '',
    password: ''
  };

  validationMessages = {
    username: {
      required: '',
      minlength: 'Username must be at least 2 characters long.',
      maxlength: 'Username cannot be more than 32 characters long.',
      pattern: 'Username must consist of a-z0-9 optionally separated by .,-,_',
      uniqueUsername: 'Username is already taken.'

    },
    email: {
      required: '',
      email: 'You need to provide a valid email.',
      maxlength: 'Do you really have so long email address?'
    },
    password: {
      required: '',
      minlength: 'Password must be at least 8 characters long',
      maxlength: 'That\'s too long.'
    }
  };

  bootstrapClass = {
    username: '',
    email: '',
    password: ''
  };

  // the form object
  signupForm: FormGroup;

  // inject modules, services
  constructor(private router: Router, private formBuilder: FormBuilder, private model: ModelService) { }

  // this will execute when the page is loaded
  ngOnInit(): void {
    this.buildForm();
  }

  /**
   * @TODO very imperfect validator
   * the goal is to have a standard async validator, which has some debounce time
   * (not firing http request all the time)
   * it didn't like to work so far
   * ideally this should be moved to another file
   *
   */

  /*
  uniqueUsernameValidator(control: AbstractControl): Promise<{[key: string]: any}> {
    clearTimeout(this.uniqueUsernameTimeout);
    return new Promise((resolve, reject) => {
      this.uniqueUsernameTimeout = setTimeout(() => {
        this.validateUniqueUsernameObservable(control.value).subscribe(resp => resolve(resp));
      }, 300);
    });
  }

  private validateUniqueUsernameObservable(username: string) {

    if (this.signupForm.get('username').invalid) {
      return new Observable(observer => observer.next(this.signupForm.get('username').errors));
    }
    return this.model.isUsernameAvailable(username).map((isUnique) => {
      if (isUnique === true) {
        return null;
      } else {
        return { uniqueUsername: true };
      }
    });
  }
  // the end of uniqueUsernameValidator

  buildForm(): void {
    this.signupForm = this.formBuilder.group({
      username: [this.user.username, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(32),
        Validators.pattern(/^[a-z0-9]+([_\-\.][a-z0-9]+)*$/)
      ], [
        this.uniqueUsernameValidator.bind(this)
      ]],
      email: [this.user.email, [
        Validators.required,
        Validators.maxLength(2048),
        CustomValidators.email,
      ]],
      password: [this.user.password, [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(1024)
      ]]
    });

    this.signupForm.valueChanges.subscribe(data => this.onValueChanged(data));

    this.signupForm.statusChanges.subscribe(data => {
      this.onStatusChanged(data);
    });

    this.onValueChanged();
    this.onStatusChanged();
  }

  onStatusChanged(data?: any) {
    // change the styling of input fields based on their validity
    let bootstrapClass = this.bootstrapClass;
    for (const field in bootstrapClass) {
      if (bootstrapClass.hasOwnProperty(field)) {
        let state = this.signupForm.get(field);
        bootstrapClass[field] = (state.valid)
                                ? 'has-success'
                                : (state.pending)
                                ? 'has-warning'
                                : (state.invalid)
                                ? 'has-error'
                                : '';
      }
    }

    // whenever status changes, we want to generate errors
    // (this is to make async validator errors visible)
    this.generateErrors();
  }

  onValueChanged(data?: any) {
    // whenever we edit any values, we want to generate errors
    this.generateErrors();
  }

  private generateErrors(): void {
    if (!this.signupForm) { return; }
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) { // required check to make for .. in work properly
        // get a control object for the field
        const control = this.signupForm.get(field);

        // we'll collect error messages to this variable
        let errorMessages = [];

        if (control && control.dirty && !control.valid) { // when control is invalid and dirty
          // get the array of all validation messages belonging to the field
          const messages = this.validationMessages[field];

          // filter the validation messages for which validation didn't pass
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              errorMessages.push(messages[key]);
            }
          }
        }
        // for every field, generate string from array of error messages
        this.formErrors[field] = errorMessages.join(' ');
      }
    }
  }

  onSubmit(): void {
    this.user = this.signupForm.value;

    this.model.createUser(this.user)
    .then(() => {
      this.router.navigate(['/user', this.user.username, 'verify-email']);
    });
    // on submit, we want to send http request POST /users to the server
    // on success (201 response) we want to redirect to a page which is awaiting the email verification code
  }
}

*/
