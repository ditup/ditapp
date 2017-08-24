import { TestBed, inject } from '@angular/core/testing';

import { GlobalErrorHandler } from './error-handler';
import { NotificationsService } from './notifications/notifications.service';

describe('GlobalErrorHandler', () => {
  let notifyErrorSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GlobalErrorHandler, NotificationsService]
    });
  });

  // spy on notifications
  beforeEach(inject([NotificationsService], (notify: NotificationsService) => {
    notifyErrorSpy = spyOn(notify, 'error');
    // don't print to console
    spyOn(console, 'error');
  }));

  it('should be created', inject([GlobalErrorHandler], (service: GlobalErrorHandler) => {
    expect(service).toBeTruthy();
  }));

  it('should notify about unexpected error', inject([GlobalErrorHandler], (service: GlobalErrorHandler) => {
    const err = new Error('unexpected error');
    service.handleError(err);

    expect(notifyErrorSpy.calls.count()).toEqual(1);
    expect(notifyErrorSpy.calls.first().args[0]).toEqual('Unexpected error: unexpected error');

  }));

  it('should notify about unreachable API (502: Bad Gateway)', inject([GlobalErrorHandler], (service: GlobalErrorHandler) => {
    const err = new Error('Bad Gateway');
    err['status'] = 502;

    service.handleError(err);
    expect(notifyErrorSpy.calls.count()).toEqual(1);
    expect(notifyErrorSpy.calls.first().args[0]).toEqual('API is down. Please report to server administrators.');

  }));
});
