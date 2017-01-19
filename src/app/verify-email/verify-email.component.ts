import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Params }   from '@angular/router';

import { NotificationsService, SimpleNotificationsComponent } from 'angular2-notifications';

import { ModelService } from '../model.service';
import { HeaderControlService } from '../header-control.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit, OnDestroy {

  verifyEmailForm: FormGroup;
  code: string;
  bootstrapCodeClass: string;
  username: string;

  // this is used to launch the after-success part of the page and hide the form
  verificationSuccess: boolean;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private notifications: NotificationsService,
              private model: ModelService,
              private headerControl: HeaderControlService) { }

  ngOnInit(): void {
    // hide the header
    this.headerControl.display(false);

    this.verificationSuccess = false;
    // fetch the username (and code if provided in url)
    this.route.params
      .subscribe((params: Params) => {
        this.username = params['username'];

        // set code if provided in url
        this.code = params['code'] || this.code;
      });

    // initialize the form
    this.buildForm();

    // submit the form immediately if the code was provided in url (probably clicked email link)
    if (this.code) {
      this.onSubmit();
    }
  }

  ngOnDestroy(): void {
    // show the header
    this.headerControl.display(true);
  }

  private buildForm() {
    this.verifyEmailForm = this.formBuilder.group({
      code: [this.code, [
        Validators.required
      ]]
    });

    this.verifyEmailForm.valueChanges.subscribe(data => this.onValueChanged(data));
  };

  private onValueChanged(data?: any) {
    // change the styling of input fields based on their validity
    let state = this.verifyEmailForm.get('code');
    this.bootstrapCodeClass = (state.valid)
                              ? 'has-success'
                              : (state.pending)
                              ? 'has-warning'
                              : (state.invalid)
                              ? 'has-error'
                              : '';
  }

  onSubmit(): void {
    this.code = this.verifyEmailForm.get('code').value;
    const notification = this.notifications.info('verifying email', `submitted ${this.username} ${this.code}`);
    console.log('submitted!', this.username, this.code);
    this.model.verifyEmail(this.username, this.code)
      .then((email) => {
        console.log(email);
        // empty the code
        this.code = '';
        // show success notification
        this.notifications.remove(notification.id);
        this.notifications.success('email verified', email);
        // show the after-success part of the page
        this.verificationSuccess = true;
      })
      .catch((err) => {
        console.log(err);
        this.notifications.remove(notification.id);
        this.notifications.error('not verified', err, { position: ['top', 'left'] });
      });
  }
}
