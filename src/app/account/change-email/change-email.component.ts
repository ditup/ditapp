import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MdSnackBar } from '@angular/material';
import * as _ from 'lodash';

import { ModelService } from '../../model.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.component.html',
  styleUrls: ['./change-email.component.scss']
})
export class ChangeEmailComponent implements OnInit {

  // the form object
  public changeEmailForm: FormGroup;

  public isSubmitSuccessful = false;
  public isSubmitting = false;

  // inject modules, services
  constructor(private formBuilder: FormBuilder,
              private model: ModelService,
              private auth: AuthService,
              private snackBar: MdSnackBar) { }

  ngOnInit(): void {
    // initialize the reactive form
    this.buildForm();
  }

  buildForm(): void {
    this.changeEmailForm = this.formBuilder.group({
      email: ['', [
        Validators.required
      ]],
      password: ['', [
        Validators.required,
      ]]
    });
  }

  async onSubmit(): Promise<void> {
    this.isSubmitting = true;

    const email = this.changeEmailForm.value['email'];
    const password = this.changeEmailForm.value['password'];

    try {
      await this.model.changeEmail(this.auth.username, email, password);

      // notify about success
      this.snackBar.open('Email updated. A message with verification link should arrive to your mailbox soon.', 'OK');

    } catch (e) {
      this.snackBar.open('Error.', 'OK');
    } finally {
      this.isSubmitting = false;
      this.changeEmailForm.reset();
    }
  }

}
