import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Idea } from 'app/shared/types';

@Component({
  selector: 'app-new-ideas',
  templateUrl: './new-ideas.component.html',
  styleUrls: ['./new-ideas.component.scss']
})
export class NewIdeasComponent implements OnInit {

  public ideas: Idea[];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(({ ideas }: { ideas: Idea[] }) => {
      this.ideas = ideas;
    });
  }

}
