import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { CustomValidators } from 'ng2-validation';

import { ModelService } from '../model.service';
import { AuthService } from '../auth.service';
import { NotificationsService } from '../notifications/notifications.service';
import { HeaderControlService } from '../header-control.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {

  // variable used for async username validator (to make debounce)
  private uniqueUsernameTimeout;

  public isFormDisabled: boolean;

  public formErrors = {
    username: [],
    email: [],
    password: []
  };

  private validationMessages = {
    username: {
      required: 'Required.',
      minlength: 'Username must be at least 2 characters long.',
      maxlength: 'Username cannot be more than 32 characters long.',
      pattern: 'Username must consist of a-z0-9 optionally separated by .,-,_',
      uniqueUsername: 'Username is already taken.'

    },
    email: {
      required: 'Required.',
      email: 'You need to provide a valid email.',
      maxlength: 'Do you really have so long email address?'
    },
    password: {
      required: 'Required.',
      minlength: 'Password must be at least 8 characters long',
      maxlength: 'That\'s too long.'
    }
  };

  // the form object
  public signupForm: FormGroup;

  // inject modules, services
  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private auth: AuthService,
              private model: ModelService,
              private notify: NotificationsService,
              private headerControl: HeaderControlService) { }

  // this will execute when the page is loaded
  ngOnInit(): void {

    // is somebody logged in?
    const isLogged = this.auth.logged;

    // log current user out
    this.auth.logout();

    // notify if logging somebody out
    if (isLogged) {
      this.notify.info('The previous user was logged out.');
    }


    // don't display the page header
    this.headerControl.display(false);
    // prepare the reactive form
    this.buildForm();
  }

  ngOnDestroy(): void {
    // display the page header again when leaving
    this.headerControl.display(true);
  }

  /**
   * @TODO very imperfect validator
   * the goal is to have a standard async validator, which has some debounce time
   * (not firing http request all the time)
   * it didn't like to work so far
   * ideally this should be moved to another file
   *
   */
  uniqueUsernameValidator(control: AbstractControl): Promise<{[key: string]: any}> {
    clearTimeout(this.uniqueUsernameTimeout);
    return new Promise((resolve) => {
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
      username: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(32),
        Validators.pattern(/^[a-z0-9]+([_\-\.][a-z0-9]+)*$/)
      ], [
        this.uniqueUsernameValidator.bind(this)
      ]],
      email: ['', [
        Validators.required,
        Validators.maxLength(2048),
        CustomValidators.email,
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(1024)
      ]]
    });

    this.signupForm.valueChanges.subscribe(() => this.onValueChanged());

    this.signupForm.statusChanges.subscribe(() => {
      this.onStatusChanged();
    });

    this.onValueChanged();
    this.onStatusChanged();
  }

  onStatusChanged() {
    // whenever status changes, we want to generate errors
    // (this is to make async validator errors visible)
    this.generateErrors();
  }

  onValueChanged() {
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
        const errorMessages = [];

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
        this.formErrors[field] = errorMessages;
      }
    }
  }

  async onSubmit() {

    // on submit, we want to send http request POST /users to the server
    // on success (201 response) we want to redirect to a page which is awaiting the email verification code
    const user: { username: string, email: string, password: string } = this.signupForm.value;

    this.isFormDisabled = true;

    try {
      // create the user
      await this.model.createUser(user);

      // redirect to email verification form
      await this.router.navigate(['/user', user.username, 'verify-email']);
    } catch (e) {
      this.notify.error(e.message);
    } finally {
      this.isFormDisabled = false;
    }

  }
}
