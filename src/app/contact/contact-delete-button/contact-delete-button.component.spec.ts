import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ContactDeleteButtonComponent } from './contact-delete-button.component';

import { MaterialModule } from '@angular/material';
import { Router } from '@angular/router';

import { ModelService } from '../../model.service';
import { AuthService } from '../../auth.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { RouterStub } from '../../../testing/router-stubs';

class ModelStubService {
  async deleteContactWith(_username: string): Promise<void> { }
}

class AuthStubService {
  username = 'user-me';
}

describe('ContactDeleteButtonComponent', () => {
  let component: ContactDeleteButtonComponent;
  let fixture: ComponentFixture<ContactDeleteButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactDeleteButtonComponent ],
      imports: [
        MaterialModule
      ],
      providers: [
        { provide: ModelService, useClass: ModelStubService },
        { provide: Router, useClass: RouterStub },
        { provide: AuthService, useClass: AuthStubService },
        NotificationsService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactDeleteButtonComponent);
    component = fixture.componentInstance;

    // Input()
    component.otherUser = { username: 'other-user' };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('performing deletion', function () {

    let notifySpy: jasmine.Spy,
        routerSpy: jasmine.Spy;

    // set spies and click the deletion button
    beforeEach(async(async () => {

      const notify = fixture.debugElement.injector.get(NotificationsService);
      notifySpy = spyOn(notify, 'info');

      const router = fixture.debugElement.injector.get(Router);
      routerSpy = spyOn(router, 'navigate');

      // activate deletion buttons
      const [activateButton] = fixture.debugElement.queryAll(By.css('button'));
      activateButton.triggerEventHandler('click', null);
      fixture.detectChanges();
      // perform the deletion
      const [, yesButton] = fixture.debugElement.queryAll(By.css('button'));
      yesButton.triggerEventHandler('click', null);
      await fixture.whenStable();

    }));

    it('[on success] should redirect to my contacts', async(async () => {
      expect(routerSpy.calls.count()).toEqual(1);
      expect(routerSpy.calls.first().args[0]).toEqual(['/user/user-me/contacts']);
    }));

    it('[on success] should notify about success', async(async () => {
      expect(notifySpy.calls.count()).toEqual(1);
      expect(notifySpy.calls.first().args[0]).toEqual('Contact with other-user was deleted.');
    }));

  });

});
