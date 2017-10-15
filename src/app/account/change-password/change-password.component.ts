import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModelService } from '../../model.service';
import { NotificationsService } from '../../notifications/notifications.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  // the form object
  public changePasswordForm: FormGroup;

  public isSubmitting = false;

  // inject modules, services
  constructor(private formBuilder: FormBuilder,
              private model: ModelService,
              private notify: NotificationsService) { }

  ngOnInit(): void {
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
      await this.model.changePassword(oldPassword, newPassword);

      // notify about success
      this.notify.info('Your password was updated.');

    } catch (e) {

      // notify about errors
      let msg: string;
      switch (e.status) {
        case 403: {
          msg = 'Old password is wrong.';
          break;
        }
        case 400: {
          msg = 'Old or new password is invalid.';
          break;
        }
        default: {
          msg = 'Unexpected error.';
        }
      }
      this.notify.error(msg);
    } finally {
      this.isSubmitting = false;
      this.changePasswordForm.reset();
    }
  }

}
