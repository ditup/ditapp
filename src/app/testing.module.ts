/**
 * This module serves as a wrapper for stub components which are shared among tests
 */

import { NgModule } from '@angular/core';

import { CommentStubComponent } from './comments/comment/comment.component';
import { CommentsStubComponent } from './comments/comments.component';
import { CommentFormStubComponent } from './comments/comment-form/comment-form.component';
import { UserSmallStubComponent } from './shared/user-small/user-small.component';

@NgModule({
  declarations: [
    CommentStubComponent,
    CommentsStubComponent,
    CommentFormStubComponent,
    UserSmallStubComponent
  ]
})
export class TestingModule { }
