import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ModelService } from '../../model.service';
import { AuthService } from '../../auth.service';
import { NotificationsService } from '../../notifications/notifications.service';

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
              private notify: NotificationsService) { }

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
      this.notify.info('Your email was updated. A message with verification link should arrive to your mailbox soon.');

    } catch (e) {
      let errMessage: string;

      switch (e.status) {
        case 403: {
          errMessage = 'The password is wrong.';
          break;
        }
        case 400: {
          errMessage = 'The provided data are invalid.';
          break;
        }
        default: {
          errMessage = 'Unexpected error.';
        }
      }

      this.notify.error(errMessage);

    } finally {
      this.isSubmitting = false;
      this.changeEmailForm.reset();
    }
  }

}
