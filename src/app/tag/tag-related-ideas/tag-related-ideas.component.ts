import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Idea } from 'app/shared/types';

@Component({
  selector: 'app-tag-related-ideas',
  templateUrl: './tag-related-ideas.component.html',
  styleUrls: ['./tag-related-ideas.component.scss']
})
export class TagRelatedIdeasComponent implements OnInit {

  public ideas: Idea[];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(({ ideas }: { ideas: Idea[] }) => {
      this.ideas = ideas;
    });
  }
}
