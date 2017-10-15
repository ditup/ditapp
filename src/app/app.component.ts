import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, PRIMARY_OUTLET } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import * as _ from 'lodash';

// import { NotificationsService } from './notifications/notifications.service';
import { ModelService } from './model.service';
import { AuthService } from './auth.service';
import { HeaderControlService } from './header-control.service';
import { DialogService } from './dialog.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    ModelService,
    AuthService,
    HeaderControlService,
    DialogService
    // NotificationsService
  ]
})
export class AppComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  constructor(private router: Router, private title: Title) {

    // subscribing to router events
    // 1. set page title
    // 2. scroll on top of a page
    this.subscription = router.events.subscribe(evt => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }

      // change page title
      console.log('changing title', evt.url);
      const url = evt.url;
      const tree = router.parseUrl(url);
      const urlSegments: any[] = _.get(tree, `root.children[${PRIMARY_OUTLET}].segments`, []);
      console.log(urlSegments);
      const text = (_.map(urlSegments, element => element.path).join(' · ') || 'welcome') + ' - ditup';
      this.title.setTitle(text);

      // scroll to a top of the page on a new page
      //
      // when there is a navigation inside page (i.e. #about), don't scroll
      if (tree.fragment !== null) {
        this.router.navigate( urlSegments, {fragment: tree.fragment});
        return;
      }
      window.scrollTo(0, 0);
    });
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
