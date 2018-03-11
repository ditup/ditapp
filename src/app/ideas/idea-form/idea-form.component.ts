/**
 * idea-form takes idea as input
 * and emits event submitIdea (with form values) on submitting the form
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Idea } from '../../shared/types';

@Component({
  selector: 'app-idea-form',
  templateUrl: './idea-form.component.html',
  styleUrls: ['./idea-form.component.scss']
})
export class IdeaFormComponent implements OnInit {

  public ideaForm: FormGroup;

  @Input() idea: Idea = { id: '', title: '', detail: '' };
  @Input() submitButtonText = 'Submit';
  @Input() disabled = false;

  @Output() submitIdea = new EventEmitter<Idea>();

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm(): void {
    this.ideaForm = this.formBuilder.group({
      title: [this.idea.title, [
        Validators.maxLength(256),
        Validators.pattern(/\S/),
        Validators.required
      ]],
      detail: [this.idea.detail, [
        Validators.maxLength(2048)
      ]]
    });
  }

  public onSubmit() {
    this.submitIdea.emit(this.ideaForm.value);
  }
}
