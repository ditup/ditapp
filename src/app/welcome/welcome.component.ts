import { Component, OnInit, OnDestroy } from '@angular/core';

import { HeaderControlService } from '../header-control.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit, OnDestroy {

  constructor(private headerControl: HeaderControlService) { }

  ngOnInit() {
    this.headerControl.display(false);
  }

  ngOnDestroy() {
    this.headerControl.display(true);
  }

}
