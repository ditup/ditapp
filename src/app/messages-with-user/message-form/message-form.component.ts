import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ModelService } from '../../model.service';

import { User, Message } from '../../shared/types';

@Component({
  selector: 'app-message-form',
  templateUrl: './message-form.component.html',
  styleUrls: ['./message-form.component.scss']
})
export class MessageFormComponent implements OnInit {

  @Output()
  public onMessageSent: EventEmitter<Message> = new EventEmitter();

  @Input()
  receiver: User;

  @ViewChild('editor') editor: any;

  public sending = false;

  public messageForm: FormGroup;
  public isFormDisabled = false;
  private message: { body: string } = { body: '' };

  public formErrors = {
    body: ''
  };

  private validationMessages = {
    body: {
      get required() { return this.pattern; },
      pattern: 'Message can\'t be empty'
    }
  };

  constructor(private formBuilder: FormBuilder,
              private model: ModelService) { }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm(): void {
    this.messageForm = this.formBuilder.group({
      body: [this.message.body, [
        Validators.required,
        Validators.maxLength(2048),
        Validators.pattern(/\S/) // must contain non-whitespace
      ]]
    });

    this.messageForm.valueChanges.subscribe(() => this.onValueChanged());
    this.onValueChanged();
  }

  onValueChanged() {
    // whenever we edit any values, we want to generate errors
    this.generateErrors();
  }

  private generateErrors(): void {
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) { // required check to make for .. in work properly
        // get a control object for the field
        const control = this.messageForm.get(field);

        // we'll collect error messages to this variable
        const errorMessages = [];

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

  public async onSubmit() {
    // disable the form until the sending is finished
    this.sending = true;
    this.isFormDisabled = true;

    const formValue: { body: string } = this.messageForm.value;

    const message: Message = await this.model.sendMessage(this.receiver.username, formValue);

    this.messageForm.reset();
    // empty the contenteditable (medium-editor) field
    this.editor.clear();

    this.isFormDisabled = false;
    this.message = formValue;

    this.onMessageSent.emit(message);

    this.sending = false;

  }
}
