import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';

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
  public formattedTagInput = '';

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
      .map(val => this.formatTagInput(val))
      .distinctUntilChanged()
      .debounceTime(400)
      .startWith(null)
      .subscribe(val => {
        this.suggestedTags = this.model.readTagsLike(val);
      });

    this.tagForm.controls['tagname'].valueChanges
      .subscribe(val => {
        this.formattedTagInput = this.formatTagInput(val);
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

  private formatTagInput(input: string): string {
    if (input === null) return '';

    return input.split(/[^a-zA-Z0-9]+/).filter(val => val.length > 0).map(str => str.toLowerCase()).join('-');
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
