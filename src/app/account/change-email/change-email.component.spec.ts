import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeEmailComponent } from './change-email.component';

import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AuthService } from '../../auth.service';
import { ModelService } from '../../model.service';
import { NotificationsService } from '../../notifications/notifications.service';

class AuthStubService { }
class ModelStubService {
  async changeEmail(): Promise<void> { }
}

describe('ChangeEmailComponent', () => {
  let component: ChangeEmailComponent;
  let fixture: ComponentFixture<ChangeEmailComponent>;
  let notifySpy: jasmine.Spy;
  let notifyErrorSpy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeEmailComponent ],
      imports: [
        ReactiveFormsModule,
        MaterialModule,
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
    fixture = TestBed.createComponent(ChangeEmailComponent);
    component = fixture.componentInstance;

    // spy on notifications
    const notify = fixture.debugElement.injector.get(NotificationsService);
    notifySpy = spyOn(notify, 'info');
    notifyErrorSpy = spyOn(notify, 'error');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('[update success] should notify', async(async () => {
    await component.onSubmit();

    expect(notifySpy.calls.count()).toEqual(1);
    expect(notifySpy.calls.first().args[0])
      .toEqual('Your email was updated. A message with verification link should arrive to your mailbox soon.');
  }));

  it('[update error 403] should notify', async(async () => {
    const model = fixture.debugElement.injector.get(ModelService);

    const err = new Error('');
    err['status'] = 403;

    spyOn(model, 'changeEmail').and.returnValue(Promise.reject(err));
    await component.onSubmit();

    expect(notifyErrorSpy.calls.count()).toEqual(1);
    expect(notifyErrorSpy.calls.first().args[0]).toEqual('The password is wrong.');
  }));

  it('[update error 400] should notify', async(async () => {
    const model = fixture.debugElement.injector.get(ModelService);

    const err = new Error('');
    err['status'] = 400;

    spyOn(model, 'changeEmail').and.returnValue(Promise.reject(err));

    await component.onSubmit();

    expect(notifyErrorSpy.calls.count()).toEqual(1);
    expect(notifyErrorSpy.calls.first().args[0]).toEqual('The provided data are invalid.');
  }));

  it('[update unexpected error] should notify', async(async () => {
    const model = fixture.debugElement.injector.get(ModelService);

    const err = new Error('');
    err['status'] = 500;

    spyOn(model, 'changeEmail').and.returnValue(Promise.reject(err));

    await component.onSubmit();

    expect(notifyErrorSpy.calls.count()).toEqual(1);
    expect(notifyErrorSpy.calls.first().args[0]).toEqual('Unexpected error.');
  }));
});
