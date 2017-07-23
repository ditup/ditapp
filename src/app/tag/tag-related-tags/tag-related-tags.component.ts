import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Tag } from '../../shared/types';

@Component({
  selector: 'app-tag-related-tags',
  templateUrl: './tag-related-tags.component.html',
  styleUrls: ['./tag-related-tags.component.scss']
})
export class TagRelatedTagsComponent implements OnInit {

  public tags: Tag[];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(({ tags }: { tags: Tag[] }) => {
      this.tags = tags;
    });
  }

}
