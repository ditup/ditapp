import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

class NewTag {
  constructor(public tagname: string, public description: string) {}
}

@Component({
  selector: 'app-tags-new-form',
  templateUrl: './tags-new-form.component.html',
  styleUrls: ['./tags-new-form.component.scss']
})
export class TagsNewFormComponent implements OnInit {

  newTagForm: FormGroup;

  isFormDisabled: boolean = false;

  isTagnameDisabled: boolean = false;

  tagFields = ['tagname', 'description'];

  newTag: NewTag;

  tagname = '';

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
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {};

  init(tag?: NewTag): void {
    this.newTag = tag || new NewTag('', '');

    this.buildForm();
  }

  private buildForm(): void {
    this.newTagForm = this.formBuilder.group({
      tagname: [this.newTag.tagname, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(64),
        Validators.pattern(/^[a-z0-9]+(\-[a-z0-9]+)*$/)
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

  onStatusChanged(data?: any) {
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

  public onSubmit(tag: any): Promise<void> {
    return Promise.resolve();
  }

  public submitAndWait() {
    this.isFormDisabled = true;
    this.onSubmit(<NewTag>this.newTagForm.value)
      .then(()=>{
        this.isFormDisabled = false;
      });
  }
}
