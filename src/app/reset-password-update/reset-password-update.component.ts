import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MdSnackBar } from '@angular/material';
import * as _ from 'lodash';

import { ModelService } from '../model.service';

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
              private snackBar: MdSnackBar) { }

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
      this.router.navigate(['/login']);
    } catch (e) {
      const messages: string[] = _.map(e.json().errors, (err: any) => (typeof(err.meta) === 'string') ? err.meta : err.meta.msg);

      const message: string = messages.join('; ');

      this.snackBar.open(message || 'Unexpected Error', 'OK');
    } finally {
      this.isSubmitting = false;
    }
  }

}
