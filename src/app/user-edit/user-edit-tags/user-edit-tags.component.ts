import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MdSnackBar } from '@angular/material';

import { ModelService } from '../../model.service';

@Component({
  selector: 'app-user-edit-tags',
  templateUrl: './user-edit-tags.component.html',
  styleUrls: ['./user-edit-tags.component.scss']
})
export class UserEditTagsComponent implements OnInit {

  @Input() username: string;

  public tags: { tagname: string, story: string, relevance: number }[];

  addTagForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private model: ModelService,
              private snackBar: MdSnackBar) { }

  ngOnInit() {
    this.buildForm();
    this.model.readUserTags(this.username)
      .then(tags => {
        this.tags = tags;
      });
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
    console.log('adding tag:', this.addTagForm.value);

    const tagname = this.addTagForm.value.tagname;
    const username = this.username;


    this.model.addTagToUser({ username, tagname, relevance: 3, story: ''})
      .then(resp => {
        console.log(resp);
        this.tags.push(resp);
        this.addTagForm.reset();
      })
      .catch(e => {
        console.log(e.json());

        const resp = e.json();

        this.addTagForm.reset();

        switch (e.status){
          case 404:
            this.snackBar.open('TODO: open a dialog for creating a new tag', 'OK');
            break;
          case 409:
            this.snackBar.open(`The tag ${tagname} was already added to you`, 'OK');
            break;
          default:
            this.snackBar.open(`An Unexpected Error. ${resp.toString()}`, 'OK');
        }
      });
  }

}
