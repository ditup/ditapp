import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
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

  // the placeholder for tag search input field
  @Input()
  public placeholder = '';

  public tagForm: FormGroup;
  public suggestedTags: Observable<Tag[]>;

  @Output()
  public action: EventEmitter<Tag> = new EventEmitter();

  @Output()
  public action404: EventEmitter<Tag> = new EventEmitter();

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
      this.action.emit({ tagname });
    } else {
      this.action404.emit({ tagname });
    }

    this.tagForm.reset();
  }

  public submitFromAutosuggestion(tagname: string) {
    this.action.emit({ tagname });
    this.tagForm.reset();
  }


}
