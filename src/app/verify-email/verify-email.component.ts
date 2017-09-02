import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { NotificationsService } from '../notifications/notifications.service';
import { has } from 'lodash';

import { ModelService } from '../model.service';
import { HeaderControlService } from '../header-control.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit, OnDestroy {

  public verifyEmailForm: FormGroup;
  private code: string;
  private username: string;
  public isSubmitting: boolean;
  public isCodeProvided: boolean;

  // this is used to launch the after-success part of the page and hide the form
  public verificationSuccess: boolean;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private notifications: NotificationsService,
              private model: ModelService,
              private headerControl: HeaderControlService) { }

  public get isFormDisabled(): boolean {
    return this.isSubmitting;
  }

  async ngOnInit(): Promise<void> {
    // hide the header
    this.headerControl.display(false);

    const params = this.route.snapshot.params;

    // fetch the username (and code if provided in url)
    this.username = params['username'];

    this.isCodeProvided = has(params, 'code');


    // when :code in /user/:username/verify-email/:code is provided
    if (this.isCodeProvided) {
      this.code = params['code'];
      try {
        await this.verifyEmail();
      } catch (e) {
        // go to the email verification form without code
        await this.router.navigate(['user', this.username, 'verify-email']);
      }
    } else {
      this.buildForm();
    }
  }

  ngOnDestroy(): void {
    // show the header
    this.headerControl.display(true);
  }

  private buildForm() {
    this.verifyEmailForm = this.formBuilder.group({
      code: ['', [
        Validators.required
      ]]
    });
  };

  async onSubmit(): Promise<void> {
    this.isSubmitting = true;

    try {
      await this.verifyEmail();
    } catch (e) {
    } finally {
      this.verifyEmailForm.reset();
      this.isSubmitting = false;
    }
  }

  async verifyEmail(): Promise<void> {

    this.code = (this.isCodeProvided) ? this.code : this.verifyEmailForm.get('code').value;

    try {
      const email = await this.model.verifyEmail(this.username, this.code);
      // notify success
      // show success notification
      this.notifications.info(`your email ${email} was successfully verified`);
      // show the after-success part of the page
      this.verificationSuccess = true;
    } catch (e) {
      // TODO notify error in more detail
      this.notifications.error('there was an error');
      throw e;
    }
  }
}
