import { Component, OnInit, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { pick, isEqual } from 'lodash';

import { ModelService } from '../../model.service';
import { DialogService } from '../../dialog.service';
import { User } from '../../shared/types';

@Component({
  selector: 'app-user-edit-profile',
  templateUrl: './user-edit-profile.component.html',
  styleUrls: ['./user-edit-profile.component.scss']
})
export class UserEditProfileComponent implements OnInit {

  public profileForm: FormGroup;

  public isFormDisabled: boolean;

  public user: User;

  public formErrors = {
    givenName: [],
    familyName: [],
    description: []
  };

  private validationMessages = {
    givenName: {
      maxlength: 'the name is too long'
    },
    familyName: {
      maxlength: 'the name is too long'
    },
    description: {
      maxlength: 'the description is too long'
    }
  };

  private profileFields = ['givenName', 'familyName', 'description'];

  constructor(private formBuilder: FormBuilder,
              private model: ModelService,
              private route: ActivatedRoute,
              private dialog: DialogService) { }

  async ngOnInit(): Promise<void> {
    this.route.parent.data
      .subscribe(({ user }: { user: User }) => {
        this.user = user;
        this.buildForm();
      });
  }

  private buildForm(): void {
    this.profileForm = this.formBuilder.group({
      givenName: [this.user.givenName, [
        Validators.maxLength(128)
      ]],
      familyName: [this.user.familyName, [
        Validators.maxLength(128)
      ]],
      description: [this.user.description, [
        Validators.maxLength(2048)
      ]]
    });

    this.profileForm.valueChanges.subscribe(data => {
      this.generateErrors();
    });
  }

  async onSubmit() {
    // disable the form until the submitting is finished
    this.isFormDisabled = true;

    const updated = await this.model.updateUser(this.user.username, this.profileForm.value) as User;

    // update the user with the new values
    this.profileFields.forEach((field) => { this.user[field] = updated[field]; });

    // update the form with the current values
    await this.profileForm.setValue(pick(this.user, this.profileFields));
    // enable the form again
    this.isFormDisabled = false;
  }

  private generateErrors(): void {
    for (const field of this.profileFields) {
      // get a control object for the field
      const control = this.profileForm.get(field);

      // we'll collect error messages to this variable
      let errorMessages = [];

      if (control && control.dirty && !control.valid) { // when control is invalid and dirty
        // get the array of all validation messages belonging to the field
        const messages = this.validationMessages[field];

        // filter the validation messages for which validation didn't pass
        for (const key in control.errors) {
          if (control.errors.hasOwnProperty(key)) {
            errorMessages.push(messages[key]);
          }
        }
      }
      // for every field, generate string from array of error messages
      this.formErrors[field] = errorMessages;
    }
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Promise<boolean> | boolean {
    // Allow synchronous navigation (`true`) if no changes


    let isUnchanged = isEqual(pick(this.user, this.profileFields), this.profileForm.value);

    if (isUnchanged) {
      return true;
    }

    // Otherwise ask the user with the dialog service and return its
    // promise which resolves to true or false when the user decides
    return this.dialog.confirm('Discard changes?');
  }

}
