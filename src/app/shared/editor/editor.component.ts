import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, SecurityContext } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
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
  @Input() placeholder = 'Type your text';
  /* Is the component position:fixed? (ensure correct position of medium-editor) */
  @Input() fixed = false;

  editor: any;

  constructor(private el: ElementRef, private sanitizer: DomSanitizer) { }

  ngOnInit() {

    // set the options
    const options: any = {
      toolbar: {
        buttons: [ 'bold', 'italic', 'underline', 'anchor', 'quote'],
        standardizeSelectionStart: true,
      },
      placeholder: {
        text: this.placeholder
      },
      paste: {
        cleanPastedHTML: true
      },
      autoLink: true,
      imageDragging: false
    };
    if (this.fixed) {
      options.elementsContainer = this.el.nativeElement.parentNode;
    }

    // initialize the medium-editor
    this.editor = new MediumEditor(this.el.nativeElement, options);
    this.setEditorContent(this.value);

    // when content changes, update the hidden textarea, too
    this.editor.subscribe('editableInput', (_event, editable) => {
      this.form.controls[this.formControlName].setValue(editable.innerHTML);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    // when value changes, update the editor content
    if (changes.value && changes.value.currentValue !== changes.value.previousValue) {
      if (this.editor) {
        this.setEditorContent(this.value);
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
    this.setEditorContent('');
  }

  private setEditorContent(value: string) {
    const sanitizedValue: SafeHtml = this.sanitizer.sanitize(SecurityContext.HTML, value);
    this.editor.setContent(sanitizedValue);
  }
}
