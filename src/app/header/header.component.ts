import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/operator/timer';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/timer';

import { HeaderControlService } from '../header-control.service';
import { ModelService } from '../model.service';
import { Store, select } from '@ngrx/store';
import * as fromRoot from 'app/reducers';
import * as authActions from 'app/actions/auth';
import { State as Auth } from 'app/reducers/auth';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  // expose avatar component to be able to reload the avatar image
  @ViewChild('avatar') avatar;

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

  public auth$: Observable<Auth>; // improve value

  private modelCountSubscription: Subscription;

  // subscriptions to observables. To be able to unsubscribe OnDestroy.
  private subscription: Subscription;
  private messageTimerSubscription: Subscription;
  // subscription for reloading avatar image
  private updateAvatarSubscription: Subscription;

  constructor(private headerControl: HeaderControlService,
              private store: Store<fromRoot.State>,
              private model: ModelService) {

    this.auth$ = this.store.pipe(select('auth'));

    // subscribe to observing whether to display the header or not
    this.subscription = this.headerControl.displayChanged$.subscribe(display => {
      this.display = display;

      this.subscribeToMessageCount();
    });

    /*
     * Reloading avatar image
     */
    this.updateAvatarSubscription = this.headerControl.updateAvatar$.subscribe(() => {
      this.avatar.reload();
    });
  }

  // expose the logout function
  public logout() {
    this.store.dispatch(new authActions.Logout())
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
    this.subscribeToMessageCount();
  }

  ngOnDestroy() {
    // avoid memory leaks by unsubscribing from observables
    this.subscription.unsubscribe();
    this.updateAvatarSubscription.unsubscribe();

    if (this.messageTimerSubscription) {
      this.messageTimerSubscription.unsubscribe();
    }
    if (this.modelCountSubscription) {
      this.modelCountSubscription.unsubscribe();
    }

  }

}
