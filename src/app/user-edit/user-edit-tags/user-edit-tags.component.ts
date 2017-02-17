import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MdSnackBar, MdDialog, MdDialogRef } from '@angular/material';

import * as _ from 'lodash';

import { TagsNewFormComponent } from '../../shared/tags-new-form/tags-new-form.component';

import { ModelService } from '../../model.service';

@Component({
  selector: 'app-user-edit-tags',
  templateUrl: './user-edit-tags.component.html',
  styleUrls: ['./user-edit-tags.component.scss']
})
export class UserEditTagsComponent implements OnInit {

  @Input() username: string;

  public tags: { tagname: string, story: string, relevance: number }[];

  public dialogRef: MdDialogRef<TagsNewFormComponent>;

  addTagForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private model: ModelService,
              private snackBar: MdSnackBar,
              private dialog: MdDialog) { }

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

    this.addTag(username, tagname)
      .catch(e => {
        console.log(e.json());

        const resp = e.json();

        this.addTagForm.reset();

        switch (e.status){
          case 404:
            // this.snackBar.open('TODO: open a dialog for creating a new tag', 'OK');
            this.openDialog(tagname);
            break;
          case 409:
            this.snackBar.open(`The tag ${tagname} was already added to you`, 'OK');
            break;
          default:
            this.snackBar.open(`An Unexpected Error. ${resp.toString()}`, 'OK');
        }
      });
  }

  addTag(username: string, tagname: string): Promise<void> {
    return this.model.addTagToUser({ username, tagname, relevance: 3, story: ''})
      .then(resp => {
        console.log(resp);
        this.tags.push(resp);
        this.addTagForm.reset();
        console.log('resetted the adding form');
      });
  }

  removeTag(tagname: string) {

    // @TODO make the state of adding and removing a tag visible
    // i.e. change color of the tag which is removed
    // add the tag immediately with different color. when saved, make the color normal
    console.log('removing tag', tagname);
    const username = this.username;

    this.model.removeUserTag(username, tagname)
      .then(() => {
        console.log('tag successfully removed');
        _.pullAllBy(this.tags, [{ tagname }], 'tagname');
      });
  }

  openDialog(tagname: string) {
    this.dialogRef = this.dialog.open(TagsNewFormComponent);
    const dialogRef = this.dialogRef;
    dialogRef.componentInstance.tagname = tagname;
    dialogRef.componentInstance.onSubmit = this.createAddTag.bind(this);
    dialogRef.componentInstance.isTagnameDisabled = true;
    dialogRef.componentInstance.init({ tagname, description: '' });

  }

  createAddTag({ tagname, description }: { tagname: string, description: string }): Promise<void> {

    console.log('creating tag in model', tagname, description);
    return this.model.createTag({ tagname, description })
      .then(() => {
        console.log('submitting the tag to the user');
        return this.addTag(this.username, tagname);
      })
      .then(() => {
        this.dialogRef.close();
      });
  }

}
