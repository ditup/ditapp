import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasswordComponent } from './change-password.component';

import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AuthService } from '../../auth.service';
import { ModelService } from '../../model.service';
import { NotificationsService } from '../../notifications/notifications.service';

class AuthStubService {
  login() {}
}
class ModelStubService {
  async changePassword(_oldPassword: string, _newPassword: string): Promise<void> { }
}

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;
  let notifySpy: jasmine.Spy;
  let notifyErrorSpy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ChangePasswordComponent
      ],
      imports: [
        MaterialModule,
        ReactiveFormsModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: AuthService, useClass: AuthStubService },
        { provide: ModelService, useClass: ModelStubService },
        NotificationsService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;

    // spy on notifications
    const notify = fixture.debugElement.injector.get(NotificationsService);
    notifySpy = spyOn(notify, 'info');
    notifyErrorSpy = spyOn(notify, 'error');

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('[submit and success] should notify', async(async () => {
    await component.onSubmit();

    expect(notifySpy.calls.count()).toEqual(1);
    expect(notifySpy.calls.first().args[0]).toEqual('Your password was updated.');
  }));

  it('[submit and error 403] should notify', async(async () => {
    const model = fixture.debugElement.injector.get(ModelService);
    const err = new Error('');
    err['status'] = 403;
    spyOn(model, 'changePassword').and.returnValue(Promise.reject(err));

    await component.onSubmit();

    expect(notifyErrorSpy.calls.count()).toEqual(1);
    expect(notifyErrorSpy.calls.first().args[0]).toEqual('Old password is wrong.');

  }));

});
