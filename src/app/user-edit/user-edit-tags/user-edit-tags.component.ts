import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ModelService } from '../../model.service';

@Component({
  selector: 'app-user-edit-tags',
  templateUrl: './user-edit-tags.component.html',
  styleUrls: ['./user-edit-tags.component.scss']
})
export class UserEditTagsComponent implements OnInit {

  @Input() username: string;

  addTagForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private model: ModelService) { }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm(): void {
    this.addTagForm = this.formBuilder.group({
      tagname: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(64),
        Validators.pattern(/^[a-z0-9]+(\-[a-z0-9]+)*$/)
      ]]
    });
  }

  onSubmit() {
    console.log('implement submitting!', this.addTagForm.value);

    const tagname = this.addTagForm.value.tagname;
    const username = this.username;

    this.addTagForm.reset();

    this.model.addTagToUser({ username, tagname, relevance: 3, story: ''})
      .then(resp => {
        console.log(resp);
      });
  }

}
