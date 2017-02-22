import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

@Component({
  selector: 'app-tag-story-form',
  templateUrl: './tag-story-form.component.html',
  styleUrls: ['./tag-story-form.component.scss']
})
export class TagStoryFormComponent {

  // the tag which we'll edit
  public tag: any;

  // keep the FormGroup in a variable
  public updateTagStoryForm: FormGroup;

  // disable the form when submitting the form or when data are invalid
  public isFormDisabled: boolean = false;

  // TODO display validation errors
  public formErrors = {
    story: ''
  };

  private validationMeasages = {
    story: {
      maxlength: 'The story is too long.'
    }
  }

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router) { }

  // initialize the component with a provided tag
  public init(tag): void {
    // attach the tag to the local variable
    this.tag = tag;

    // build the form
    this.buildForm();
  }

  private buildForm(): void {
    this.updateTagStoryForm = this.formBuilder.group({
      story: [this.tag.story, [
        Validators.maxLength(512)
      ]]
    });
  }

  // A default method for submitting the form. Does nothing.
  // It is likely to be overwritten.
  public processForm(tag: { tagname: string, story: string }): Promise<void> {
    return Promise.resolve();
  }

  // A method to be called when submitting the form.
  public onSubmit() {
    // disable the form until finished
    this.isFormDisabled = true;

    // collect the data
    const tagname = this.tag.tagname;
    const story = this.updateTagStoryForm.value.story;

    // process the data
    this.processForm({ tagname, story })
      .then(() => {
        // finished => enable the form again
        this.isFormDisabled = false;
      });
  }

}
