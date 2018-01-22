import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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

  // tslint:disable-next-line:no-output-on-prefix
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

    // general form structure
    const initialFormData = {
      message: this.data.message,
      trust: [this.data.trust, [Validators.required]],
      reference: this.data.reference
    };

    // remove the fields which shouldn't be present in this form
    for (const field of this.disabledFields) {
      delete initialFormData[field];
    }

    this.contactForm = this.formBuilder.group(initialFormData);
  }

  onSubmitWrapper() {
    if (this.contactForm.valid) {
      this.onSubmit.emit(this.contactForm.value);
    }
  }

}
