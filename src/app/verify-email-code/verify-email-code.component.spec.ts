import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { VerifyEmailCodeComponent } from './verify-email-code.component';

import { AuthService } from '../auth.service';
import { HeaderControlService } from '../header-control.service';
import { ModelService } from '../model.service';
import { NotificationsService } from '../notifications/notifications.service';

class ActivatedRouteStub {
  snapshot = {
    params: {
      username: 'test-user',
      code: '0123456789abcdef0123456789abcdef'
    }
  };
}

class AuthStubService {
  logout() { }
  login(_token: string) { }
}

class ModelStubService {
  async verifyEmail(_username: string, _code: string) {
    return { email: 'email@example.com', token: 'aaaa.bbbb.cccc', isNewUser: false };
  }
}

class ModelStubService2 {
  async verifyEmail(_username: string, _code: string) {
    return { email: 'email@example.com', token: 'aaaa.bbbb.cccc', isNewUser: true };
  }
}

class RouterStub {
  navigate() { }
}

describe('VerifyEmailCodeComponent', () => {

  let component: VerifyEmailCodeComponent;
  let fixture: ComponentFixture<VerifyEmailCodeComponent>;
  let notifyErrorSpy: jasmine.Spy;
  let notifyInfoSpy: jasmine.Spy;
  let authLogoutSpy: jasmine.Spy;
  let authLoginSpy: jasmine.Spy;
  let navigateSpy: jasmine.Spy;


  describe('logged in', () => {

    const authStubService = {
      logout: () => { },
      logged: true
    };

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [ VerifyEmailCodeComponent ],
        providers: [
          { provide: AuthService, useValue: authStubService },
          { provide: ActivatedRoute, useClass: ActivatedRouteStub },
          HeaderControlService,
          { provide: ModelService, useClass: ModelStubService },
          NotificationsService,
          { provide: Router, useClass: RouterStub }
        ]
      })
      .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(VerifyEmailCodeComponent);
      component = fixture.componentInstance;

      const notify = fixture.debugElement.injector.get(NotificationsService);
      notifyInfoSpy = spyOn(notify, 'info');
      const auth = fixture.debugElement.injector.get(AuthService);
      authLogoutSpy = spyOn(auth, 'logout');

      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('log out and inform', () => {
      expect(authLogoutSpy.calls.count()).toEqual(1);
      expect(notifyInfoSpy.calls.count()).toEqual(1);
      expect(notifyInfoSpy.calls.argsFor(0)[0]).toEqual('The previous user was logged out.');
    });
  });

  describe('successful verification', () => {

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [ VerifyEmailCodeComponent ],
        providers: [
          { provide: AuthService, useClass: AuthStubService },
          { provide: ActivatedRoute, useClass: ActivatedRouteStub },
          HeaderControlService,
          { provide: ModelService, useClass: ModelStubService },
          NotificationsService,
          { provide: Router, useClass: RouterStub }
        ]
      })
      .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(VerifyEmailCodeComponent);
      component = fixture.componentInstance;

      const notify = fixture.debugElement.injector.get(NotificationsService);
      notifyInfoSpy = spyOn(notify, 'info');
      const auth = fixture.debugElement.injector.get(AuthService);
      authLoginSpy = spyOn(auth, 'login');
      const router = fixture.debugElement.injector.get(Router);
      navigateSpy = spyOn(router, 'navigate');

      fixture.detectChanges();
    });

    it('log in', async(async () => {
      await fixture.whenStable();
      expect(authLoginSpy.calls.count()).toEqual(1);
      expect(authLoginSpy.calls.argsFor(0)[0]).toEqual('aaaa.bbbb.cccc');
    }));

    it('redirect to /', async(async () => {
      await fixture.whenStable();

      expect(navigateSpy.calls.count()).toEqual(1);
      expect(navigateSpy.calls.argsFor(0)[0]).toEqual(['/']);
    }));

    it('notify success', async(async () => {
      await fixture.whenStable();

      expect(notifyInfoSpy.calls.count()).toEqual(1);
      expect(notifyInfoSpy.calls.argsFor(0)[0]).toEqual('your email email@example.com was successfully verified');
    }));
  });

  describe('successful verification of new user', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [ VerifyEmailCodeComponent ],
        providers: [
          { provide: AuthService, useClass: AuthStubService },
          { provide: ActivatedRoute, useClass: ActivatedRouteStub },
          HeaderControlService,
          { provide: ModelService, useClass: ModelStubService2 },
          NotificationsService,
          { provide: Router, useClass: RouterStub }
        ]
      })
      .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(VerifyEmailCodeComponent);
      component = fixture.componentInstance;

      const notify = fixture.debugElement.injector.get(NotificationsService);
      notifyInfoSpy = spyOn(notify, 'info');
      const router = fixture.debugElement.injector.get(Router);
      navigateSpy = spyOn(router, 'navigate');

      fixture.detectChanges();
    });

    it('redirect to /welcome', async(async () => {
      await fixture.whenStable();

      expect(navigateSpy.calls.count()).toEqual(1);
      expect(navigateSpy.calls.argsFor(0)[0]).toEqual(['/welcome']);
    }));

  });

  describe('failed verification', () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [ VerifyEmailCodeComponent ],
        providers: [
          { provide: AuthService, useClass: AuthStubService },
          { provide: ActivatedRoute, useClass: ActivatedRouteStub },
          HeaderControlService,
          { provide: ModelService, useClass: ModelStubService },
          NotificationsService,
          { provide: Router, useClass: RouterStub }
        ]
      })
      .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(VerifyEmailCodeComponent);
      component = fixture.componentInstance;

      const notify = fixture.debugElement.injector.get(NotificationsService);
      notifyErrorSpy = spyOn(notify, 'error');

      const model = fixture.debugElement.injector.get(ModelService);
      spyOn(model, 'verifyEmail').and.returnValue(Promise.reject({
        status: 400,
        message: 'wrong code'
      }));

      fixture.detectChanges();
    });

    it('inform about failure and tell why', async(async () => {
      await fixture.whenStable();

      expect(notifyErrorSpy.calls.count()).toEqual(1);
      expect(notifyErrorSpy.calls.argsFor(0)[0]).toEqual('there was an error: wrong code');
    }));
  });
});
