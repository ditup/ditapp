import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordUpdateComponent } from './reset-password-update.component';

import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterStub } from '../../testing/router-stubs';

import { ModelService } from '../model.service';
import { NotificationsService } from '../notifications/notifications.service';

class ModelStubService {
  async resetPassword() {

  }
}

class ActivatedRouteStub {
  snapshot = {
    params: {
      username: 'username',
      code: 'code'
    }
  }
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
    fixture.detectChanges();

    // spy notifications
    const notify = fixture.debugElement.injector.get(NotificationsService);
    notifyInfoSpy = spyOn(notify, 'info');
    notifyErrorSpy = spyOn(notify, 'error');

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('[successful update] should notify about success', async(async () => {
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
