import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as MediumEditor from 'medium-editor';

@Component({
  selector: '[appEditor]', // tslint:disable-line:component-selector
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, OnChanges, OnDestroy {
  @Input() form: FormGroup;
  @Input() value = '';
  @Input() formControlName: string;
  /* Is the component position:fixed? (ensure correct position of medium-editor) */
  @Input() fixed = false;

  editor: any;

  constructor(private el: ElementRef) { }

  ngOnInit() {

    // set the options
    const options: any = { };
    if (this.fixed) {
      options.elementsContainer = this.el.nativeElement.parentNode;
    }

    // initialize the medium-editor
    this.editor = new MediumEditor(this.el.nativeElement, options);
    this.editor.setContent(this.value);

    // when content changes, update the hidden textarea, too
    this.editor.subscribe('editableInput', (_event, editable) => {
      this.form.controls[this.formControlName].setValue(editable.innerHTML);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    // when value changes, update the editor content
    if (changes.value && changes.value.currentValue !== changes.value.previousValue) {
      if (this.editor) {
        this.editor.setContent(this.value);
      }
    }
  }

  ngOnDestroy() {
    // clean
    if (this.editor) {
      this.editor.destroy();
    }
  }

  clear() {
    this.editor.setContent('');
  }
}
