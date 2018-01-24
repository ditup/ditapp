import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Tag } from '../../shared/types';

@Component({
  selector: 'app-welcome-tags',
  templateUrl: './welcome-tags.component.html',
  styleUrls: ['./welcome-tags.component.scss']
})
export class WelcomeTagsComponent implements OnInit {

  public popularTags: Tag[];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data
      .subscribe(({ popularTags }: { popularTags: Tag[] }) => {
        this.popularTags = popularTags;
      });
  }

}
