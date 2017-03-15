import { Component, OnInit, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';

import * as _ from 'lodash';

import { ModelService } from '../model.service';
import { DialogService } from '../dialog.service';
import { Tag } from '../shared/types';

@Component({
  selector: 'app-tag-edit',
  templateUrl: './tag-edit.component.html',
  styleUrls: ['./tag-edit.component.scss']
})
export class TagEditComponent implements OnInit {

  // the form object
  public tagForm: FormGroup;
  // form will be disabled during submitting
  public isFormDisabled: boolean = false;
  // the main tag object
  public tag: Tag;

  public formErrors = {
    description: ''
  };

  // true when xhr in process
  public tagLoading: boolean;
  // true when tag was found; false when tag was not found (404)
  public tagExists: boolean;

  private validationMessages = {
    description: {
      maxlength: 'The description is too long (max. 2048 characters).'
    }
  };

  constructor(private formBuilder: FormBuilder,
              private model: ModelService,
              private route: ActivatedRoute,
              private router: Router,
              private dialog: DialogService) { }

  ngOnInit(): void {

    // observe the tagname parameter
    this.route.params.subscribe(async (params: Params) => {

      try {
        // load the tag from database
        this.tagLoading = true;
        const tagname: string = params['tagname'];
        this.tag = await this.model.readTag(tagname);

        this.tagLoading = false;
        this.tagExists = true;

        this.buildForm();
      } catch (e) {
        this.tagLoading = false;

        if (e.status === 404) {
          this.tagExists = false;
        } else {
          throw e;
        }
      }
    });

  }

  private buildForm(): void {
    this.tagForm = this.formBuilder.group({
      description: [this.tag.description, [
        Validators.maxLength(2048)
      ]]
    });

    this.tagForm.statusChanges.subscribe(data => this.onStatusChanged(data));

    this.onStatusChanged();
  }

  async onSubmit(): Promise<any> {
    // disable the form until the submitting is finished
    this.isFormDisabled = true;

    const tagname = this.tag.tagname;
    const description: string = this.tagForm.value.description;

    console.log(description);

    try {
      const response = await this.model.updateTag(tagname, { description });
      console.log(response);
      this.isFormDisabled = false;
      this.tag.description = description;

      // redirect to the new tag page
      this.router.navigate(['/tag', tagname]);
    } catch (e) {
      this.isFormDisabled = false;
      console.log('errored!', e);
    }
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Promise<boolean> | boolean {

    // Allow synchronous navigation (`true`) if no changes
    let isUnchanged = _.isEqual(this.tag.description, this.tagForm.value.description);

    if (isUnchanged) {
      return true;
    }

    // Otherwise ask the user with the dialog service and return its
    // promise which resolves to true or false when the user decides
    return this.dialog.confirm('You have some unsaved work. Do you still want to leave?');
  }

  onStatusChanged(data?: any) {
    // whenever status of data changes, we want to re-generate errors
    this.generateErrors();
  }

  private generateErrors(): void {
    if (!this.tagForm) { return; }
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) { // required check to make for .. in work properly
        // get a control object for the field
        const control = this.tagForm.get(field);

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
        this.formErrors[field] = errorMessages.join(' ');
      }
    }
  }
}


