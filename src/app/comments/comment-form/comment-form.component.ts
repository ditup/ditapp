import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Comment } from 'app/shared/types';
import { EditorComponent } from 'app/shared/editor/editor.component';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.scss']
})
export class CommentFormComponent implements OnInit {

  public commentForm: FormGroup;

  // text for submit button
  @Input() submitButtonText = 'Submit';
  // is form disabled
  @Input() disabled = false;
  // comment to edit (can be left empty)
  @Input() comment: Comment;
  // are we saving new comment, or updating?
  @Input() isNew = true;

  // emit when comment is submitted
  @Output() submitComment = new EventEmitter<Comment>();
  // emit when cancel button is clicked
  @Output() cancel = new EventEmitter<void>();

  @ViewChild('editor') editor: EditorComponent;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm(): void {
    // take the content from provided comment or empty string
    const content = (this.comment) ? this.comment.content : '';
    this.commentForm = this.formBuilder.group({
      content: [content, [
        Validators.maxLength(1024),
        Validators.pattern(/\S/),
        Validators.required
      ]]
    });
  }

  // action when form is submitted
  public onSubmit() {
    this.submitComment.emit(this.commentForm.value);
    if (this.isNew) {
      this.commentForm.reset();
      this.editor.clear();
    }
  }

  // action when editing is cancelled
  public onClickCancel() {
    this.cancel.emit();
  }
}

/**
 * Stub component for testing
 */
@Component({ selector: 'app-comment-form', template: '' })
export class CommentFormStubComponent {
  @Input() submitButtonText;
  @Input() disabled;
  @Input() comment;
  @Input() isNew;
  @Output() submitComment = new EventEmitter();
  @Output() cancel = new EventEmitter();
}
