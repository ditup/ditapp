import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Idea } from '../../shared/types';

@Component({
  selector: 'app-ideas-with-my-tags',
  templateUrl: './ideas-with-my-tags.component.html',
  styleUrls: ['./ideas-with-my-tags.component.scss']
})
export class IdeasWithMyTagsComponent implements OnInit {

  public ideas: Idea[];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(({ ideas }: { ideas: Idea[] }) => {
      this.ideas = ideas;
    });
  }

}
