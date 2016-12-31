import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Params }   from '@angular/router';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {

  verifyEmailForm: FormGroup;
  code: string;
  bootstrapCodeClass: string;
  username: string;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute) { }

  ngOnInit(): void {
    // fetch the username (and code if provided in url)
    this.route.params
      .subscribe((params: Params) => {
        console.log(params, '####');
        this.username = params['username'];

        console.log(this.username);
        // set code if provided in url
        this.code = params['code'] || this.code;
      });

    // initialize the form
    this.buildForm();

    // submit the form immediately if the code was provided in url (probably clicked email link)
    if (this.code) {
      this.onSubmit();
    }
  }

  private buildForm() {
    this.verifyEmailForm = this.formBuilder.group({
      code: [this.code, [
        Validators.required
      ]]
    });

    this.verifyEmailForm.valueChanges.subscribe(data => this.onValueChanged(data));
  };

  private onValueChanged(data?: any) {
    // change the styling of input fields based on their validity
    let state = this.verifyEmailForm.get('code');
    this.bootstrapCodeClass = (state.valid)
                              ? 'has-success'
                              : (state.pending)
                              ? 'has-warning'
                              : (state.invalid)
                              ? 'has-error'
                              : '';
  }

  onSubmit(): void {
    this.code = this.verifyEmailForm.get('code').value;
    console.log('submitted!', this.username, this.code);
  }
}
