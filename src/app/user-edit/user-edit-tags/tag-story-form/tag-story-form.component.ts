import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { UserTag } from 'app/models/user-tag';

@Component({
  selector: 'app-tag-story-form',
  templateUrl: './tag-story-form.component.html',
  styleUrls: ['./tag-story-form.component.scss']
})
export class TagStoryFormComponent implements OnInit {

  // the user-tag which we'll edit
  @Input()
  public userTag: UserTag;

  // keep the FormGroup in a variable
  public updateTagStoryForm: FormGroup;

  // disable the form when submitting the form or when data are invalid
  public isFormDisabled = false;

  // TODO display validation errors
  public formErrors = {
    story: ''
  };

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.init(this.userTag);
  }

  // initialize the component with a provided tag
  public init(userTag: UserTag): void {
    // attach the tag to the local variable
    this.userTag = userTag;

    // build the form
    this.buildForm();
  }

  private buildForm(): void {
    this.updateTagStoryForm = this.formBuilder.group({
      story: [this.userTag.story, [
        Validators.maxLength(512)
      ]]
    });
  }

  // A default method for submitting the form. Does nothing.
  // It is likely to be overwritten.
  @Output()
  submitting = new EventEmitter<{ userId: string, tagId: string, story: string }>();

  // A method to be called when submitting the form.
  public async onSubmit() {
    // collect the data
    const { userId, tagId } = this.userTag;
    const story = this.updateTagStoryForm.value.story;

    // process the data
    this.submitting.emit({ userId, tagId, story });
  }

}
