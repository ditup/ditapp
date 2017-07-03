import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Tag } from '../shared/types';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit {

  public tag: Tag;
  public tagExists: boolean;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    // observe the tagname parameter
    this.route.data.subscribe(({ tag }: { tag: Tag }) => {
      this.tag = tag;
    });
  }
}
