import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { Tag } from '../../shared/types';

@Component({
  selector: 'app-tags-related-to-my-tags',
  templateUrl: './tags-related-to-my-tags.component.html',
  styleUrls: ['./tags-related-to-my-tags.component.scss']
})
export class TagsRelatedToMyTagsComponent implements OnInit {

  public tags: Tag[];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(({ tags }) => {
      this.tags = tags;
    });
  }

}
