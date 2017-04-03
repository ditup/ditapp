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

  profileForm: FormGroup;

  isFormDisabled: boolean = true;

  username: string;

  public user = new User('');

  formErrors = {};
  validationMessages = {};
  private profileFields = ['givenName', 'familyName', 'description'];

  constructor(private formBuilder: FormBuilder,
              private model: ModelService,
              private route: ActivatedRoute,
              private dialog: DialogService) { }

  async ngOnInit(): Promise<void> {
    this.username = this.route.snapshot.params['username'];
    this.buildForm();
    this.user = await this.model.readUser(this.username) as User;
    this.profileForm.setValue(_.pick(this.user, this.profileFields));
    console.log('*****');
    this.isFormDisabled = false;
  }

  private buildForm(): void {
    console.log(this.user);
    this.profileForm = this.formBuilder.group(_.pick(this.user, this.profileFields));
  }

  onSubmit() {
    // disable the form until the submitting is finished
    this.isFormDisabled = true;

    this.model.updateUser(this.username, this.profileForm.value).then(updated => {
      console.log(updated);
      // update the form with the current values
      this.user = updated as User;
      this.profileForm.setValue(_.pick(this.user, this.profileFields));
      // enable the form again
      this.isFormDisabled = false;
    });
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Promise<boolean> | boolean {
    // Allow synchronous navigation (`true`) if no changes


    let isUnchanged = _.isEqual(this.user, this.profileForm.value);

    if (isUnchanged) {
      return true;
    }

    // Otherwise ask the user with the dialog service and return its
    // promise which resolves to true or false when the user decides
    return this.dialog.confirm('Discard changes?');
  }

}
