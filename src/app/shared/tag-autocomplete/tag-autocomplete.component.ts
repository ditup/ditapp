import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/filter';

import { Tag } from 'app/models/tag';
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
      .startWith('')
      .subscribe(val => {
        // ask server only if value is truthy
        this.suggestedTags = (val) ? this.model.readTagsLike(val) : of([]);
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
      this.action.emit({ id: tagname });
    } else {
      this.action404.emit({ id: tagname });
    }

    this.tagForm.reset();
  }

  public submitFromAutosuggestion(tagname: string) {
    this.action.emit({ id: tagname });
    this.tagForm.reset();
  }

}
