import { Component, OnInit, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

import { ModelService } from '../model.service';
import { DialogService } from '../dialog.service';

class NewTag {
  constructor(public tagname: string, public description: string) {}
}

@Component({
  selector: 'app-tags-new',
  templateUrl: './tags-new.component.html',
  styleUrls: ['./tags-new.component.scss']
})
export class TagsNewComponent implements OnInit {

  // make debounce in unique tagname validator
  private uniqueTagnameTimeout;

  newTagForm: FormGroup;

  isFormDisabled: boolean = false;

  tagFields = ['tagname', 'description'];

  newTag: NewTag;

  formErrors = {
    tagname: '',
    description: ''
  };

  bootstrapClass = {
    tagname: '',
    description: ''
  };

  validationMessages = {
    tagname: {
      required: '',
      minlength: 'Tagname must be at least 2 characters long.',
      maxlength: 'Tagname cannot be more than 32 characters long.',
      pattern: 'Tagname must consist of a-z0-9 optionally separated by - (dash).',
      uniqueTagname: 'Tagname already exists.'
    },
    description: {
      maxlength: 'Limited length (improve!)'
    }
  };

  constructor(private formBuilder: FormBuilder,
              private model: ModelService,
              private route: ActivatedRoute,
              private router: Router,
              private dialog: DialogService) { }

  ngOnInit(): void {
    this.newTag = new NewTag('', '');

    this.buildForm();
  }

  private buildForm(): void {
    this.newTagForm = this.formBuilder.group({
      tagname: [this.newTag.tagname, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(64),
        Validators.pattern(/^[a-z0-9]+(\-[a-z0-9]+)*$/)
      ], [
        this.uniqueTagnameValidator.bind(this)
      ]],
      description: [this.newTag.description, [
        Validators.maxLength(2048)
      ]]
    });

    this.newTagForm.valueChanges.subscribe(data => this.onValueChanged(data));

    this.newTagForm.statusChanges.subscribe(data => {
      this.onStatusChanged(data);
    });

    this.onValueChanged();
    this.onStatusChanged();
  }

  onSubmit() {
    // disable the form until the submitting is finished
    this.isFormDisabled = true;

    const formValue: NewTag = <NewTag>this.newTagForm.value;

    this.model.createTag(formValue)
      .then(response => {
        console.log(response);
        this.isFormDisabled = false;
        this.newTag = formValue;

        // redirect to the new tag page
        this.router.navigate(['/tag', formValue.tagname]);
      })
      .catch(e => {
        console.log('errored!', e);
      });
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Promise<boolean> | boolean {
    // Allow synchronous navigation (`true`) if no changes

    let isUnchanged = _.isEqual(this.newTag, this.newTagForm.value);

    if (isUnchanged) {
      return true;
    }

    // Otherwise ask the user with the dialog service and return its
    // promise which resolves to true or false when the user decides
    return this.dialog.confirm('You have some unsaved work. Do you still want to leave?');
  }

  /**
   * @TODO very imperfect validator
   * the goal is to have a standard async validator, which has some debounce time
   * (not firing http request all the time)
   * it didn't like to work so far
   * ideally this should be moved to another file
   *
   */
  uniqueTagnameValidator(control: AbstractControl): Promise<{[key: string]: any}> {
    clearTimeout(this.uniqueTagnameTimeout);
    return new Promise((resolve, reject) => {
      this.uniqueTagnameTimeout = setTimeout(() => {
        this.validateUniqueTagnameObservable(control.value).subscribe(resp => resolve(resp));
      }, 300);
    });
  }

  private validateUniqueTagnameObservable(tagname: string) {

    if (this.newTagForm.get('tagname').invalid) {
      return new Observable(observer => observer.next(this.newTagForm.get('tagname').errors));
    }
    return this.model.isTagnameAvailable(tagname).map((isUnique) => {
      if (isUnique === true) {
        return null;
      } else {
        return { uniqueTagname: true };
      }
    });
  }
  // the end of uniqueTagnameValidator


  onStatusChanged(data?: any) {
    // change the styling of input fields based on their validity
    let bootstrapClass = this.bootstrapClass;
    for (const field in bootstrapClass) {
      if (bootstrapClass.hasOwnProperty(field)) {
        let state = this.newTagForm.get(field);
        bootstrapClass[field] = (state.valid)
                                ? 'has-success'
                                : (state.pending)
                                ? 'has-warning'
                                : (state.invalid)
                                ? 'has-error'
                                : '';
      }
    }

    // whenever status changes, we want to generate errors
    // (this is to make async validator errors visible)
    this.generateErrors();
  }

  onValueChanged(data?: any) {
    // whenever we edit any values, we want to generate errors
    this.generateErrors();
  }

  private generateErrors(): void {
    if (!this.newTagForm) { return; }
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) { // required check to make for .. in work properly
        // get a control object for the field
        const control = this.newTagForm.get(field);

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

