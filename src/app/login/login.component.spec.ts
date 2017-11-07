/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MaterialModule } from '../material.module';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NotificationsService } from '../notifications/notifications.service';

import { LoginComponent } from './login.component';
import { ModelService } from '../model.service';
import { AuthService } from '../auth.service';
import { HeaderControlService } from '../header-control.service';

import { RouterStub } from '../../testing/router-stubs';

class ModelStubService {

  async getJwtToken(username: string, _password: string): Promise<string> {

    if (['user1'].includes(username)) {
      return [
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        'eyJ1c2VybmFtZSI6InVzZXIxIiwiZW1haWxfdmVyaWZpZWQiOnRydWV9',
        'LGDiZd_ZPFuHrQmkTh39s8UEcqNprqB1T5k-OYOTTO8'
      ].join('.');
    }

    const err = new Error('Not Authenticated');
    err['status'] = 401;
    throw err;
  }
}

class ActivatedRouteStub {
  snapshot = {
    queryParams: {}
  };
}

class AuthStubService {
  logged = true;

  logout() {
    this.logged = false;
  }
  login() {
    this.logged = true;
  }
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let notifyInfoSpy: jasmine.Spy;
  let notifyErrorSpy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,
        MaterialModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: Router, useClass: RouterStub },
        { provide: ModelService, useClass: ModelStubService },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: AuthService, useClass: AuthStubService },
        NotificationsService,
        HeaderControlService,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    const notify = fixture.debugElement.injector.get(NotificationsService);
    notifyInfoSpy = spyOn(notify, 'info');
    notifyErrorSpy = spyOn(notify, 'error');

    fixture.detectChanges();
  });

  async function submitForm(username: string, password: string) {
    // fill form
    component.loginForm.controls['username'].setValue(username);
    component.loginForm.controls['password'].setValue(password);
    fixture.detectChanges();

    // submit form
    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('submit', null);

    await fixture.whenStable();
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('logged in at the beginning', () => {

    it('should log out the logged in user at the beginning', () => {
      const auth = fixture.debugElement.injector.get(AuthService);
      expect(auth.logged).toEqual(false);
    });

    it('should notify that user was logged out, if logged in', () => {
      fixture.detectChanges();
      expect(notifyInfoSpy.calls.count()).toEqual(1);
      expect(notifyInfoSpy.calls.argsFor(0)[0]).toEqual('The previous user was logged out.');
    });

  });

  it('should notify on successful login', async(async () => {
    notifyInfoSpy.calls.reset();

    await submitForm('user1', 'password');

    // check notifications
    expect(notifyInfoSpy.calls.count()).toEqual(1);
    expect(notifyInfoSpy.calls.mostRecent().args[0]).toEqual('You were authenticated.');
  }));

  it('should notify on wrong credentials error', async(async () => {
    await submitForm('nonexistent-user', 'password');

    // check notifications
    expect(notifyErrorSpy.calls.count()).toEqual(1);
    expect(notifyErrorSpy.calls.first().args[0]).toEqual('Username or password don\'t match.');
  }));

  it('should notify on other errors', async(async () => {
    // provide unexpected error
    const model = fixture.debugElement.injector.get(ModelService);

    const err = new Error('Internal Server Error');
    err['status'] = 500;
    spyOn(model, 'getJwtToken').and.returnValue(Promise.reject(err));

    // submit form
    await submitForm('error-user', 'password');

    // check notifications
    expect(notifyErrorSpy.calls.count()).toEqual(1);
    expect(notifyErrorSpy.calls.first().args[0]).toEqual('Unexpected error.');
  }));
});
