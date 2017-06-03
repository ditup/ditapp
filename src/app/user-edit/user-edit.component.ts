import { Component, OnInit, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import * as _ from 'lodash';

import { ModelService } from '../model.service';
import { DialogService } from '../dialog.service';
import { User } from '../shared/types';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

  public profileForm: FormGroup;

  public isFormDisabled: boolean;

  public user: User;

  formErrors = {};
  validationMessages = {};
  private profileFields = ['givenName', 'familyName', 'description'];

  constructor(private formBuilder: FormBuilder,
              private model: ModelService,
              private route: ActivatedRoute,
              private dialog: DialogService) { }

  async ngOnInit(): Promise<void> {
    this.route.data
      .subscribe(({ user }: { user: User }) => {
        this.user = user;
        this.buildForm();
      });
  }

  private buildForm(): void {
    this.profileForm = this.formBuilder.group(_.pick(this.user, this.profileFields));
  }

  async onSubmit() {
    // disable the form until the submitting is finished
    this.isFormDisabled = true;

    const updated = await this.model.updateUser(this.user.username, this.profileForm.value) as User;

    // update the user with the new values
    this.profileFields.forEach((field) => { this.user[field] = updated[field]; });

    // update the form with the current values
    await this.profileForm.setValue(_.pick(this.user, this.profileFields));
    // enable the form again
    this.isFormDisabled = false;
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Promise<boolean> | boolean {
    // Allow synchronous navigation (`true`) if no changes


    let isUnchanged = _.isEqual(_.pick(this.user, this.profileFields), this.profileForm.value);

    if (isUnchanged) {
      return true;
    }

    // Otherwise ask the user with the dialog service and return its
    // promise which resolves to true or false when the user decides
    return this.dialog.confirm('Discard changes?');
  }

}
