import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Tag } from 'app/models/tag';
import { ModelService } from '../../model.service';


@Component({
  selector: 'app-tags-random',
  templateUrl: './tags-random.component.html',
  styleUrls: ['./tags-random.component.scss']
})
export class TagsRandomComponent implements OnInit {

  public tags: Tag[];

  constructor(private route: ActivatedRoute, private model: ModelService) { }

  ngOnInit() {
    this.route.data.subscribe(({ tags }: { tags: Tag[] }) => {
      this.tags = tags;
    });
  }

  public async reloadTags() {
    this.tags = await this.model.findRandomTags();
  }

}
