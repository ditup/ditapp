import { ErrorHandler, Injectable, Injector } from '@angular/core';

import { NotificationsService } from './notifications/notifications.service';

@Injectable()
export class GlobalErrorHandler extends ErrorHandler implements ErrorHandler {

  constructor(private injector: Injector) { super(); }

  handleError(error) {

    // execute the ErrorHandler.handleError()
    super.handleError(error);

    let message = `Unexpected error: ${error.message || error.msg || error}`;

    // handle special cases
    switch (error.status) {
      case 502: {
        message = 'API is down. Please report to server administrators.';
        break;
      }
    }

    // notify the error
    const notify = this.injector.get(NotificationsService);
    notify.error(message, { ttl: 0 });
  }

}
