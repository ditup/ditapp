import { Component, Input, EventEmitter, OnInit, Output } from '@angular/core';

import { Tag } from '../types';

@Component({
  selector: 'app-edit-tags',
  templateUrl: './edit-tags.component.html',
  styleUrls: ['./edit-tags.component.scss']
})
export class EditTagsComponent implements OnInit {

  @Input() tags: Tag[] = [{ tagname: 'tag1' }];
  @Output() addTag = new EventEmitter<Tag>();
  @Output() addNonexistentTag = new EventEmitter<Tag>();
  @Output() removeTag = new EventEmitter<Tag>();

  constructor() { }

  ngOnInit() {
  }

  /**
   * Adding existent tag
   */
  onAddTag(tag: Tag) {
    this.addTag.emit(tag);
  }

  /**
   * Adding tag which doesn't yet exist
   */
  onAddNonexistentTag(tag: Tag) {
    this.addNonexistentTag.emit(tag);
  }

  /**
   * Removing tag
   */
  onRemoveTag(tag: Tag) {
    this.removeTag.emit(tag);
  }
}
