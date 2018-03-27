import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Authenticate } from 'app/models/auth';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  // the form object
  public loginForm: FormGroup;

  @Output() submitting = new EventEmitter<Authenticate>();
  @Input() pending = false;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    // initialize the reactive form
    this.buildForm();
  }

  buildForm(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [
        Validators.required
      ]],
      password: ['', [
        Validators.required
      ]]
    });
  }

  onSubmit() {
    this.submitting.emit(this.loginForm.value);
  }

}
