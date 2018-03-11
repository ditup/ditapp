import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';

import { AuthService } from 'app/auth.service';
import { ModelService } from 'app/model.service';
import { Comment } from 'app/shared/types';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  // comment to display or edit
  @Input() comment: Comment;
  // is this a comment or a reaction?
  @Input() isReaction = false;
  // event 'remove' raised after this comment is removed from api
  // should be used for removing it from whatever list it resides
  @Output() remove = new EventEmitter<void>();
  // are we asking for confirmation whether to delete?
  public isDeleteDisplayed = false;
  // buttons can be disabled i.e. when some action is in progress
  public areButtonsDisabled = false;
  // are we showing comment form for editing the comment?
  public isEditing = false;
  // is the comment form disabled? (i.e. when we're saving it)
  public isFormDisabled = false;

  // show reply form?
  public isReplying = false;

  constructor(private auth: AuthService,
              private model: ModelService) { }

  // is logged user the creator of this comment?
  // (should we display edit, delete buttons?)
  get isCreatorMe() {
    return this.comment.creator.username === this.auth.username;
  }

  ngOnInit() {
  }

  // turn delete-commment confirmation on and off
  askReallyDelete(really: boolean) {
    this.isDeleteDisplayed = really;
  }

  // delete comment from database
  async deleteComment() {
    // disable comment actions during saving
    this.areButtonsDisabled = true;

    // delete the comment
    await this.model.deleteComment(this.comment.id, (this.isReaction) ? 'reactions' : 'comments');

    // enable comment actions again
    this.areButtonsDisabled = false;

    // inform parent that the comment was deleted
    this.remove.emit();
  }

  // display comment-form for updating the comment (or turn it off)
  editComment(edit: boolean) {
    this.isEditing = edit;
  }

  // save comment edits
  async updateComment(comment: Comment) {
    // disable the form and buttons
    this.areButtonsDisabled = true;
    this.isFormDisabled = true;

    // save the update to database
    comment.id = this.comment.id;
    const updated: Comment = await this.model.updateComment(comment, (this.isReaction) ? 'reactions' : 'comments');

    // update the comment with the saved data
    this.comment.content = updated.content;

    // enable the form and buttons and stop editing
    this.areButtonsDisabled = false;
    this.isFormDisabled = false;
    this.editComment(false);
  }

  displayReactionForm(display: boolean) {
    this.isReplying = display;
  }

  async createReaction(reply: Comment) {
    const savedReaction = await this.model.addCommentTo({ id: this.comment.id, type: 'comments' }, reply, 'reactions');

    this.comment.reactions = this.comment.reactions || [];
    this.comment.reactions.push(savedReaction);

    this.displayReactionForm(false);
  }

  // reaction is already deleted from server, should just be removed from the list
  removeReaction(reaction: Comment) {
    _.pullAllBy(this.comment.reactions, [reaction], 'id');
  }

}

/**
 * Stub component
 */
@Component({ selector: 'app-comment', template: '' })
export class CommentStubComponent {
  @Input() comment;
  @Input() isReaction;
  @Output() remove;
}
