import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ModelService } from '../model.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  // the form object
  public resetPasswordForm: FormGroup;

  public isSubmitSuccessful = false;
  public isSubmitting = false;

  // inject modules, services
  constructor(private formBuilder: FormBuilder,
              private model: ModelService) { }

  ngOnInit(): void {
    // initialize the reactive form
    this.buildForm();
  }

  buildForm(): void {
    this.resetPasswordForm = this.formBuilder.group({
      usernameEmail: ['', [
        Validators.required
      ]]
    });
  }

  async onSubmit(): Promise<void> {
    this.isSubmitting = true;
    try {
      const usernameEmail = this.resetPasswordForm.value['usernameEmail'];
      await this.model.requestResetPassword(usernameEmail);
      this.isSubmitSuccessful = true;
    } catch (e) {
      console.log(e);
    } finally {
      this.isSubmitting = false;
    }
  }
}
