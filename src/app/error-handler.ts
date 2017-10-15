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
      case 403: {
        message = 'Your authentication expired. Please copy your work to somewhere, log out and log in.';
        break;
      }
    }

    // notify the error
    const notify = this.injector.get(NotificationsService);
    notify.error(message);
  }

}
