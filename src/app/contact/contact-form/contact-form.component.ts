import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit {
  public contactForm: FormGroup;

  @Input()
  public data = {
    message: '',
    trust: null,
    reference: ''
  };

  @Input() isFormDisabled = false;


  @Output() onSubmit = new EventEmitter<{ message?: string, trust?: number, reference?: string }>();

  @Input()
  public fields = ['message', 'trust', 'reference'];

  public disabledFields: string[];

  public trustLevels = [
    {
      value: 1,
      label: 'not met in reality, know each other from online. some trust'
    },
    {
      value: 2,
      label: 'acquaintance, friend. trust'
    },
    {
      value: 4,
      label: 'good friend, collaborator. high trust'
    },
    {
      value: 8,
      label: 'close friend, family, long term collaborator. full trust.'
    }
  ];

  public formErrors = {};

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.disabledFields = _.difference(['message', 'trust', 'reference'], this.fields);
    this.buildForm();
  }

  private buildForm(): void {
    const initialFormData = this.data;
    for (const field of this.disabledFields) {
      delete initialFormData[field];
    }

    console.log(initialFormData, this.disabledFields);

    // TODO validation

    this.contactForm = this.formBuilder.group(initialFormData);
  }

  async onSubmitWrapper() {
    this.onSubmit.emit(this.contactForm.value);
  }

}
