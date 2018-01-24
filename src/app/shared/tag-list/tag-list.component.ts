import { Component, Input, OnInit } from '@angular/core';

import { Tag } from '../types';

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.scss']
})
export class TagListComponent implements OnInit {

  @Input() tags: Tag[] = [];

  @Input() linksDisabled = false;

  constructor() { }

  ngOnInit() {
  }

}
