import { Component, OnInit, OnDestroy } from '@angular/core';

import { NotificationsService } from './notifications.service';

import { Notification } from '../shared/types';

import { Subscription }   from 'rxjs/Subscription';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {

  public notificationHeight: number;

  public notifications: Notification[] = [];

  // get only the existent notifications
  public get displayedNotifications() {
    // get only notifications which are not undefined,
    // and TODO assign id to each notification
    return this.notifications.filter((note) => {
      const exists = Boolean(note);
      return exists;
    });
  }

  public notifySubscription: Subscription;

  constructor(private notifyControl: NotificationsService) {
    // subscribe to observing whether to display the header or not
    this.notifySubscription = this.notifyControl.notificationsChanged$.subscribe((notifications: Notification[]) => {
      this.notifications = notifications;
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.notifySubscription.unsubscribe();
  }

}
