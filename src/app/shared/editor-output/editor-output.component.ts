import { Component, Input, OnChanges, SecurityContext, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-editor-output',
  templateUrl: './editor-output.component.html',
  styleUrls: ['./editor-output.component.scss']
})
export class EditorOutputComponent implements OnChanges {


  @Input() value: string;

  public sanitizedValue: SafeHtml;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnChanges(changes: SimpleChanges) {
    // when value changes, sanitize it again
    if (changes.value && changes.value.previousValue !== changes.value.currentValue) {
      this.sanitizedValue = this.sanitizer.sanitize(SecurityContext.HTML, this.value);
    }
  }

}
