import { Component, OnInit, OnDestroy } from '@angular/core';

import { HeaderControlService } from '../header-control.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  constructor(private headerControl: HeaderControlService) { }

  ngOnInit() {
    this.headerControl.display(false);
  }

  ngOnDestroy() {
    this.headerControl.display(true);
  }

}
