import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

import { Notification } from '../shared/types';

@Injectable()
export class NotificationsService {

  private notifications: Notification[] = [];

  private notificationSource = new Subject<Notification[]>();

  notificationsChanged$ = this.notificationSource.asObservable();

  private publish() {
    this.notificationSource.next(this.notifications);
  }

  // remove old and add new notifications
  public create(notifications: Notification[]) {
    this.notifications = notifications.map((notification, index) => {
      notification.id = index;
      return notification;
    });

    this.publish();
  }

  // add one notification
  public add(notification: Notification) {
    notification.id = this.notifications.length;
    this.notifications.push(notification);

    if (notification.ttl > 0) {
      setTimeout(() => {
        if (notification) {
          this.remove(notification.id);
        }
      }, notification.ttl);
    }

    this.publish();
    return notification.id;
  }

  // remove all notifications
  public clear() {
    this.notifications = [];
    this.publish();
  }

  // remove a specific notification
  public remove(id: number|string) {
    delete this.notifications[id];
    this.publish();
  }

  public info(msg: string, { ttl = 5000 } = { }) {
    return this.add({ msg, type: 'info', ttl });
  }

  public error(msg: string, { ttl = 5000 } = { }) {
    return this.add({ msg, type: 'error', ttl });
  }


  constructor() { }

}
