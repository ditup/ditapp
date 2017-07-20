import { Component, OnInit } from '@angular/core';

import { Tag } from '../../shared/types';

import { ModelService } from '../../model.service';

@Component({
  selector: 'app-tags-related-to-tags',
  templateUrl: './tags-related-to-tags.component.html',
  styleUrls: ['./tags-related-to-tags.component.scss']
})
export class TagsRelatedToTagsComponent implements OnInit {

  public tags: Tag[] = [];

  constructor(private model: ModelService) { }

  ngOnInit() {
  }

  public async findRelatedTags(tags: Tag[]) {
    this.tags = await this.model.findTagsByTags(tags);
  }

}
