import { Component, Input, OnInit } from '@angular/core';

import { ModelService } from '../../model.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { Idea, Tag, TagList } from '../../shared/types';

@Component({
  selector: 'app-idea-tag-editor',
  templateUrl: './idea-tag-editor.component.html',
  styleUrls: ['./idea-tag-editor.component.scss']
})
export class IdeaTagEditorComponent implements OnInit {

  @Input() idea: Idea;
  @Input() tags: Tag[];
  ideaTags: TagList;

  constructor(private model: ModelService,
              private notify: NotificationsService) { }

  ngOnInit() {
    this.ideaTags = new TagList(this.tags);
  }

  async addTag(tag: Tag) {
    // add tag to list and disable it
    try {
      this.ideaTags.add(tag.tagname);
    } catch (e) {
      this.notify.error(`Tag ${tag.tagname} is already added.`);
      return;
    }

    const tagInList = this.ideaTags.find(tag.tagname);
    tagInList['disabled'] = true;
    // save the tag to database
    await this.model.addIdeaTag(this.idea.id, tag.tagname);
    // enable tag
    delete tagInList['disabled'];
  }

  async createAddTag(tag: Tag) {
    // create tag
    await this.model.createTag(tag);
    // add tag
    await this.addTag(tag);
  }

  async removeTag(tag: Tag) {
    // disable tag in list
    this.ideaTags.find(tag.tagname)['disabled'] = true;
    // remove tag from api
    await this.model.removeIdeaTag(this.idea.id, tag.tagname);
    // remove tag from list
    this.ideaTags.remove(tag.tagname);
  }
}
