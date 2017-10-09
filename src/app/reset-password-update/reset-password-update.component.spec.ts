import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordUpdateComponent } from './reset-password-update.component';

import { MaterialModule } from '../material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterStub } from '../../testing/router-stubs';

import { AuthService } from '../auth.service';
import { ModelService } from '../model.service';
import { NotificationsService } from '../notifications/notifications.service';

class ModelStubService {
  async resetPassword() { }
}

class AuthStubService {
  logged = true;
  logout() {
    this.logged = false;
  }
}

class ActivatedRouteStub {
  snapshot = {
    params: {
      username: 'username',
      code: 'code'
    }
  };
}

describe('ResetPasswordUpdateComponent', () => {
  let component: ResetPasswordUpdateComponent;
  let fixture: ComponentFixture<ResetPasswordUpdateComponent>;

  let notifyInfoSpy: jasmine.Spy;
  let notifyErrorSpy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetPasswordUpdateComponent ],
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: AuthService, useClass: AuthStubService },
        { provide: ModelService, useClass: ModelStubService },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: Router, useClass: RouterStub },
        NotificationsService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordUpdateComponent);
    component = fixture.componentInstance;

    // spy notifications
    const notify = fixture.debugElement.injector.get(NotificationsService);
    notifyInfoSpy = spyOn(notify, 'info');
    notifyErrorSpy = spyOn(notify, 'error');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should log out if somebody is logged in, and notify about it', () => {
    const auth = fixture.debugElement.injector.get(AuthService);
    expect(auth.logged).toEqual(false);

    expect(notifyInfoSpy.calls.count()).toEqual(1);
    expect(notifyInfoSpy.calls.argsFor(0)[0]).toEqual('The previous user was logged out.');

  });

  it('[successful update] should notify about success', async(async () => {
    notifyInfoSpy.calls.reset();
    // update the password
    await component.onSubmit();
    // expect a success notification
    expect(notifyInfoSpy.calls.count()).toEqual(1);
    expect(notifyInfoSpy.calls.first().args[0]).toEqual('Password was updated.');
  }));

  it('[invalid code] should notify error', async(async () => {
    const model = fixture.debugElement.injector.get(ModelService);
    const err = new Error('');
    err['status'] = 400;

    spyOn(model, 'resetPassword').and.returnValue(Promise.reject(err));
    // update the password
    await component.onSubmit();
    // expect a success notification
    expect(notifyErrorSpy.calls.count()).toEqual(1);
    expect(notifyErrorSpy.calls.first().args[0]).toEqual('Reset link is invalid or expired.');
  }));

  it('[nonexistent username] should notify error', async(async () => {
    const model = fixture.debugElement.injector.get(ModelService);
    const err = new Error('');
    err['status'] = 404;

    spyOn(model, 'resetPassword').and.returnValue(Promise.reject(err));
    // update the password
    await component.onSubmit();
    // expect a success notification
    expect(notifyErrorSpy.calls.count()).toEqual(1);
    expect(notifyErrorSpy.calls.first().args[0]).toEqual('User doesn\'t exist.');
  }));
});
