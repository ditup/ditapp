import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { ModelService } from '../model.service';
import { NotificationsService } from '../notifications/notifications.service';

@Component({
  selector: 'app-reset-password-update',
  templateUrl: './reset-password-update.component.html',
  styleUrls: ['./reset-password-update.component.scss']
})
export class ResetPasswordUpdateComponent implements OnInit {

  // the form object
  public updatePasswordForm: FormGroup;

  public isSubmitSuccessful = false;
  public isSubmitting = false;

  public username: string;

  // inject modules, services
  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private model: ModelService,
              private notify: NotificationsService) { }

  ngOnInit(): void {
    this.username = this.route.snapshot.params['username'];
    // initialize the reactive form
    this.buildForm();
  }

  buildForm(): void {
    this.updatePasswordForm = this.formBuilder.group({
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(1024)
      ]]
    });
  }

  async onSubmit(): Promise<void> {
    this.isSubmitting = true;

    const password = this.updatePasswordForm.value['password'];
    const username = this.route.snapshot.params['username'];
    const code = this.route.snapshot.params['code'];

    try {
      await this.model.resetPassword(username, password, code);
      // notify about success
      this.notify.info('Password was updated.');
      // go to login page
      await this.router.navigate(['/login']);
    } catch (e) {
      // notify about errors
      let message: string;

      switch (e.status) {
        case 400: {
          message = 'Reset link is invalid or expired.';
          break;
        }
        case 404: {
          message = 'User doesn\'t exist.';
          break;
        }
        default: {
          message = 'Unexpected error.';
        }
      }

      this.notify.error(message);
    } finally {
      this.isSubmitting = false;
    }
  }

}
