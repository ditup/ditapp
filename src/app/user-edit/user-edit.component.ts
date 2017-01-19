import { Component, OnInit, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import * as _ from 'lodash';

import { ModelService } from '../model.service';
import { DialogService } from '../dialog.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

  profileForm: FormGroup;

  isFormDisabled: boolean = true;

  username: string;

  profileFields = ['givenName', 'familyName', 'description'];

  profile = {
    givenName: '',
    familyName: '',
    description: ''
  };

  formErrors = {};
  validationMessages = {};

  bootstrapClass = {
    givenName: '',
    familyName: '',
    description: ''
  };

  constructor(private formBuilder: FormBuilder,
              private model: ModelService,
              private route: ActivatedRoute,
              private dialog: DialogService) { }

  ngOnInit(): Promise<void> {
    this.username = this.route.snapshot.params['username'];

    this.buildForm();

    return this.model.readUser(this.username).then(user => {
      console.log('received user to edit', user);
      _.assign(this.profile, _.pick(user, this.profileFields));

      this.profileForm.setValue(_.pick(this.profile, this.profileFields));

      this.isFormDisabled = false;

    });

  }

  private buildForm(): void {
    this.profileForm = this.formBuilder.group({
      givenName: [this.profile.givenName],
      familyName: [this.profile.familyName],
      description: [this.profile.description]
    });
  }

  onSubmit() {
    // disable the form until the submitting is finished
    this.isFormDisabled = true;

    // _.assign(this.profile, this.profileForm.value);

    this.model.updateUser(this.username, this.profileForm.value).then(updated => {
      console.log(updated);
      // update the form with the current values
      _.assign(this.profile, _.pick(updated, this.profileFields));
      this.profileForm.setValue(this.profile);
      // enable the form again
      this.isFormDisabled = false;
    });
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Promise<boolean> | boolean {
    // Allow synchronous navigation (`true`) if no changes


    let isUnchanged = _.isEqual(this.profile, this.profileForm.value);

    if (isUnchanged) {
      return true;
    }

    // Otherwise ask the user with the dialog service and return its
    // promise which resolves to true or false when the user decides
    return this.dialog.confirm('Discard changes?');
  }

}
