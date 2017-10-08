import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/operator/timer';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/timer';

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

  private modelCountSubscription: Subscription;

  // subscriptions to observables. To be able to unsubscribe OnDestroy.
  private subscription: Subscription;
  private authSubscription: Subscription;
  private messageTimerSubscription: Subscription;

  constructor(private headerControl: HeaderControlService,
              private auth: AuthService,
              private model: ModelService) {

    // subscribe to observing whether to display the header or not
    this.subscription = this.headerControl.displayChanged$.subscribe(display => {
      this.display = display;

      this.subscribeToMessageCount();
    });

    // subscribe to observing the login values
    this.authSubscription = this.auth.loggedStatusChanged$.subscribe(
      ({logged, username, loggedUnverified }: {logged: boolean, username: string, loggedUnverified: boolean }) => {
      this.logged = logged;
      this.username = username;
      this.loggedUnverified = loggedUnverified;
      this.subscribeToMessageCount();
    });

  }

  // expose the logout function
  public logout() {
    this.auth.logout();
  }

  /*
   * we want to refresh the timer when we
   * - log in
   * - display the header
   */

  private subscribeToMessageCount() {
    if (this.messageTimerSubscription) {
      this.messageTimerSubscription.unsubscribe();
    }

    if (this.display && this.logged) {
      this.messageTimerSubscription = Observable.timer(0, 30000)
        .subscribe(async () => {

          if (this.modelCountSubscription) {
            this.modelCountSubscription.unsubscribe();
          }

          this.modelCountSubscription = this.model.countUnreadMessages().subscribe((count: number) => {
            this.messageCount = count;
            this.modelCountSubscription.unsubscribe();
          });
        });
    }
  }


  ngOnInit() {

    // initialize the authentication values
    this.logged = this.auth.logged;
    this.loggedUnverified = this.auth.loggedUnverified;
    this.username = this.auth.username;

    this.subscribeToMessageCount();
  }

  ngOnDestroy() {
    // avoid memory leaks by unsubscribing from observables
    this.subscription.unsubscribe();
    this.authSubscription.unsubscribe();

    if (this.messageTimerSubscription) {
      this.messageTimerSubscription.unsubscribe();
    }
    if (this.modelCountSubscription) {
      this.modelCountSubscription.unsubscribe();
    }

  }

}
