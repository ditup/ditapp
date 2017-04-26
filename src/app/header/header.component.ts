import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription }   from 'rxjs/Subscription';
import { Observable }   from 'rxjs/Observable';
// import 'rxjs/add/operator/timer';
import 'rxjs/add/operator/map';

import { HeaderControlService } from '../header-control.service';
import { AuthService } from '../auth.service';
import { ModelService } from '../model.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  // should the header be displayed? default = true.
  public display = true;
  // is the user logged in and verified email?
  public logged: boolean;
  // is the user logged in and unverified email?
  public loggedUnverified: boolean;
  // if logged, what is her username?
  public username: string;
  // how many unread messages do we have?
  public messageCount: number;

  // subscriptions to observables. To be able to unsubscribe OnDestroy.
  private subscription: Subscription;
  private authSubscription: Subscription;

  constructor(private headerControl: HeaderControlService,
              private auth: AuthService,
              private model: ModelService) {

    // subscribe to observing whether to display the header or not
    this.subscription = this.headerControl.displayChanged$.subscribe(display => {
      this.display = display;
    });

    // subscribe to observing the login values
    this.authSubscription = this.auth.loggedStatusChanged$.subscribe(
      ({logged, username, loggedUnverified }: {logged: boolean, username: string, loggedUnverified: boolean }) => {
      this.logged = logged;
      this.username = username;
      this.loggedUnverified = loggedUnverified;
    });
  }

  // expose the logout function
  public logout() {
    this.auth.logout();
  };


  ngOnInit() {

    // initialize the authentication values
    this.logged = this.auth.logged;
    this.loggedUnverified = this.auth.loggedUnverified;
    this.username = this.auth.username;

    // load unread message count and update regularly
    Observable.timer(0, 60000)
      .subscribe(async () => {
        if (this.logged) {
          this.messageCount = await this.model.countUnreadMessages().toPromise();
        }
      });
  }

  ngOnDestroy() {
    // avoid memory leaks by unsubscribing from observables
    this.subscription.unsubscribe();
    this.authSubscription.unsubscribe();
  }

}
