import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription }   from 'rxjs/Subscription';

import { HeaderControlService } from '../header-control.service';
import { AuthService } from '../auth.service';

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

  // expose the logout function
  public logout = this.auth.logout;

  // subscriptions to observables. To be able to unsubscribe OnDestroy.
  private subscription: Subscription;
  private authSubscription: Subscription;

  constructor(private headerControl: HeaderControlService,
              private auth: AuthService) {

    // subscribe to observing whether to display the header or not
    this.subscription = this.headerControl.displayChanged$.subscribe(display => {
      this.display = display;
    });

    // subscribe to observing the login values
    this.authSubscription = this.auth.loggedStatusChanged$.subscribe(
      ({logged, username, loggedUnverified }: {logged: boolean, username: string, loggedUnverified: boolean }) => {
      console.log('auth subscribed!', username, logged, loggedUnverified);
      this.logged = logged;
      this.username = username;
      this.loggedUnverified = loggedUnverified;
    });
  }

  ngOnInit() {
    // initialize the authentication values
    this.logged = this.auth.logged;
    this.loggedUnverified = this.auth.loggedUnverified;
    this.username = this.auth.username;
  }

  ngOnDestroy() {
    // avoid memory leaks by unsubscribing from observables
    this.subscription.unsubscribe();
    this.authSubscription.unsubscribe();
  }

}
