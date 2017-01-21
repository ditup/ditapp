import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, PRIMARY_OUTLET } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import * as _ from 'lodash';

import { ModelService } from './model.service';
import { BasicAuthService } from './basic-auth.service';
import { AuthService } from './auth.service';
import { HeaderControlService } from './header-control.service';
import { DialogService } from './dialog.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    ModelService,
    BasicAuthService,
    AuthService,
    HeaderControlService,
    DialogService
  ]
})
export class AppComponent implements OnInit, OnDestroy {

  // options of notifications @TODO this should be improved, not defined here
  options = {};

  private subscription: Subscription;
  private scrollUpSubscription: Subscription;

  constructor(private router: Router, private title: Title) {

    // changing of page title
    this.subscription = router.events.subscribe(event => {
      console.log('changing title', event.url);
      let url = event.url;
      let tree = router.parseUrl(url);
      let urlSegments: any[] = _.get(tree, `root.children[${PRIMARY_OUTLET}].segments`, []);
      console.log(urlSegments);
      let text = (_.map(urlSegments, element => element.path).join(' · ') || 'welcome') + ' - ditup';
      this.title.setTitle(text);
    });
  }

  ngOnInit() {

    // scrolling on top of the page on every route change
    this.scrollUpSubscription = this.router.events.subscribe(evt => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.scrollUpSubscription.unsubscribe();
  }
}
