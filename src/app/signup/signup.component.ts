import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { CustomValidators } from 'ng2-validation';

import { NewUser } from '../new-user';
import { uniqueUsernameValidator } from '../shared/unique-username.directive';
import { ModelService } from '../model.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

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

  buildForm(): void {
    this.signupForm = this.formBuilder.group({
      username: [this.user.username, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(32),
        Validators.pattern(/^[a-z0-9]+([_\-\.][a-z0-9]+)*$/)
      ], [
        uniqueUsernameValidator
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
  }

  onValueChanged(data?: any) {
    if (!this.signupForm) { return; }
    const form = this.signupForm;

    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        const control = form.get(field);

        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          console.log(control.errors);
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit(): void {
    // this is just testing. TODO remove
    console.log('submitted!!!');
    console.log(this.signupForm.value);
    this.user = this.signupForm.value;

    this.model.createUser(this.user)
    .then(() => {
      this.router.navigate(['/user', this.user.username, 'verify-email']);
    });
    // on submit, we want to send http request POST /users to the server
    // on success (201 response) we want to redirect to a page which is awaiting the email verification code
  }
}
