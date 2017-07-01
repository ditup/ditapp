import { Component, OnInit, OnDestroy } from '@angular/core';

import { HeaderControlService } from '../../header-control.service';

@Component({
  selector: 'app-not-logged',
  templateUrl: './not-logged.component.html',
  styleUrls: ['./not-logged.component.scss']
})
export class NotLoggedComponent implements OnInit, OnDestroy {

  constructor(private headerControl: HeaderControlService) { }

  ngOnInit() {
    this.headerControl.display(false);
  }

  ngOnDestroy() {
    this.headerControl.display(true);
  }

}
