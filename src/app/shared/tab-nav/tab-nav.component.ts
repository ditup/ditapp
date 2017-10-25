import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab-nav',
  templateUrl: './tab-nav.component.html',
  styleUrls: ['./tab-nav.component.scss']
})
export class TabNavComponent implements OnInit {

  @Input() navRoutes: { title: string, link: string }[] = [];
  constructor() { }

  ngOnInit() {
  }

}
