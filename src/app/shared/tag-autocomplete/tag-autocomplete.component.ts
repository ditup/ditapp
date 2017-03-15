import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Observable } from 'rxjs/Observable';

import { Tag } from '../types';
import { ModelService } from '../../model.service';

@Component({
  selector: 'app-tag-autocomplete',
  templateUrl: './tag-autocomplete.component.html',
  styleUrls: ['./tag-autocomplete.component.scss']
})
export class TagAutocompleteComponent implements OnInit {

  @Input()
  public placeholder: string = 'placeholder';

  public tagForm: FormGroup;
  public suggestedTags: Observable<Tag[]>;

  constructor(private formBuilder: FormBuilder,
              private model: ModelService) { }

  ngOnInit() {
    // activate the form
    this.buildForm();

    // search tags when input value changes
    this.tagForm.controls['tagname'].valueChanges
      .debounceTime(400)
      .startWith(null)
      .subscribe(val => {
        this.suggestedTags = this.model.readTagsLike(val);
      });
  }

  private buildForm(): void {
    this.tagForm = this.formBuilder.group({
      tagname: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(64),
        Validators.pattern(/^[a-z0-9]+(\-[a-z0-9]+)*$/)
      ]]
    });
  }

  public async onSubmit(): Promise<void> {
    const tagname = this.tagForm.value.tagname;

    // does the tagname exist?
    const exists = await this.model.tagExists(tagname);

    if (exists) {
      await this.action(tagname);
    } else {
      await this.action404(tagname);
    }

    this.tagForm.reset();
  }

  public async submitFromAutosuggestion(tagname: string): Promise<void> {
    await this.action(tagname);

    this.tagForm.reset();
  }

  @Input()
  public async action(tagname: string): Promise<void> {}

  @Input()
  public async action404(tagname: string): Promise<void> {}

}
