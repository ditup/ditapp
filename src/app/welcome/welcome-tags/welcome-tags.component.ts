import { Component, OnInit } from '@angular/core';

import { Tag } from '../../shared/types';

@Component({
  selector: 'app-welcome-tags',
  templateUrl: './welcome-tags.component.html',
  styleUrls: ['./welcome-tags.component.scss']
})
export class WelcomeTagsComponent implements OnInit {

  public popularTags: Tag[] = [
   { tagname: 'popular-tag-0' },
   { tagname: 'popular-tag-1' },
   { tagname: 'popular-tag-2' },
   { tagname: 'popular-tag-3' }
  ];

  constructor() { }

  ngOnInit() {
  }

}
