import { Component, OnInit } from '@angular/core';

import { AppNotification } from 'app/models/app-notification';
import { RemoveAppNotification } from 'app/actions/app-notify';

import { Observable } from 'rxjs/Observable';
import { Store, select } from '@ngrx/store';

import * as fromRoot from 'app/reducers';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  // public notificationHeight: number;

  public notifications$: Observable<AppNotification[]>;

  constructor(private store: Store<fromRoot.State>) {
    this.notifications$ = this.store.pipe(select(fromRoot.getAppNotifications));
  }

  ngOnInit() {
  }

  removeNotification(id: string) {
    this.store.dispatch(new RemoveAppNotification(id));
  }

}
