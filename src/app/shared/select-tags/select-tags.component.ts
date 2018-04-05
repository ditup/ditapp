import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { MatDialog } from '@angular/material';

import { ModelService } from '../../model.service';
import { AuthService } from '../../auth.service';
import { NotificationsService } from '../../notifications/notifications.service';

import { SelectFromMyTagsComponent } from '../../shared/select-from-my-tags/select-from-my-tags.component';

import { TagList, Tag } from '../../shared/types';

@Component({
  selector: 'app-select-tags',
  templateUrl: './select-tags.component.html',
  styleUrls: ['./select-tags.component.scss']
})
export class SelectTagsComponent implements OnInit {

  public tagList = new TagList();

  // tslint:disable-next-line:no-output-on-prefix
  @Output() public onSelected = new EventEmitter<Tag[]>();

  constructor(private auth: AuthService,
              private model: ModelService,
              private notify: NotificationsService,
              private dialog: MatDialog) { }

  ngOnInit() {
  }

  public addTagToList({ id: tagname }: Tag) {
    try {
      // add tag to list
      this.tagList.add(tagname);
      this.emitSelection();
    } catch (e) {
      // TODO other errors?
      this.notify.error(`The tag ${tagname} is already added.`);
    }
  }

  private addTagsToList(tags: Tag[]) {

    const tagnames = tags.map(tag => tag.id);

    if (tagnames.length === 0) {
      return;
    }

    const alreadyAdded: string[] = [];
    // add tags to list
    tagnames.forEach((tagname: string) => {
      try {
        this.tagList.add(tagname);
      } catch (e) {
        alreadyAdded.push(tagname);
      }
    });

    if (alreadyAdded.length > 0) {
      // TODO This shouldn't happen. But perhaps notify error?
    }

    // send info to Output
    this.emitSelection();
  }

  public removeTagFromList({ id: tagname }: Tag) {
    try {
      this.tagList.remove(tagname);
      // send info to Output
      this.emitSelection();
    } catch (e) {
      // TODO notify
    }
  }

  public async openMyTagsDialog() {
    const myTagsDialog = this.dialog.open(SelectFromMyTagsComponent);

    const dialog = myTagsDialog.componentInstance;
    dialog.ref = myTagsDialog;

    dialog.loading = true;

    const myTags = await this.model.readUserTags(this.auth.username);

    dialog.originalSelection = this.tagList.tags;
    dialog.userTags = myTags;
    dialog.generateMyTags.call(dialog);
    dialog.loading = false;

    dialog.onSubmit.subscribe((tags: Tag[]) => {
      this.addTagsToList(tags);
    });
  }

  public clearSelection() {
    this.tagList.tags = [];
    // send info to Output
    this.emitSelection();
  }

  private emitSelection() {
    this.onSelected.emit(this.tagList.tags);
  }

  public complainNonexistentTag ({ id: tagname }: Tag) {
    this.notify.error(`Tag ${tagname} doesn't exist.`);
  }
}
