import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MdSnackBar } from '@angular/material';
import * as _ from 'lodash';

import { ModelService } from '../model.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  // the form object
  public changePasswordForm: FormGroup;

  public isSubmitSuccessful = false;
  public isSubmitting = false;

  public username: string;
  public email: string;

  // inject modules, services
  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private model: ModelService,
              private auth: AuthService,
              private snackBar: MdSnackBar) { }

  ngOnInit(): void {
    this.username = this.auth.username;
    this.email = this.auth.email;
    // initialize the reactive form
    this.buildForm();
  }

  buildForm(): void {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: ['', [
        Validators.required
      ]],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(512)
      ]]
    });
  }

  async onSubmit(): Promise<void> {
    this.isSubmitting = true;

    const oldPassword = this.changePasswordForm.value['oldPassword'];
    const newPassword = this.changePasswordForm.value['newPassword'];

    try {
      await this.model.changePassword(this.auth.username, oldPassword, newPassword);
      // update the auth password
      this.auth.login({ method: 'basic', credentials: { username: this.auth.username, password: newPassword, email: this.auth.email } });

      // notify about success
      this.snackBar.open('Password updated.', 'OK');

    } catch (e) {
      this.snackBar.open('Error.', 'OK');
    } finally {
      this.isSubmitting = false;
      this.changePasswordForm.reset();
    }
  }

}
