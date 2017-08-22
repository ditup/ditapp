import { ErrorHandler, Injectable, Injector } from '@angular/core';

import { NotificationsService } from './notifications/notifications.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor(private injector: Injector) { }

  handleError(error) {
    console.error(error);
    let message = `Unexpected error: ${error.message || error}`;

    // handle special cases
    switch (error.status) {
      case 502: {
        message = 'API is down. Please report to server administrators.';
        break;
      }
    }

    // notify the error
    const notify = this.injector.get(NotificationsService);
    notify.error(message);
    throw error;
  }

}
