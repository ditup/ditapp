import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { FooterControlService } from './footer-control.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {

  // display the footer or not?
  public display = true;
  private displaySubscription: Subscription;

  constructor(private footerControl: FooterControlService) {
    // subscribe to observing whether to display the footer or not
    this.displaySubscription = this.footerControl.displayChanged$.subscribe(display => {
      this.display = display;
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.displaySubscription.unsubscribe();
  }
}
