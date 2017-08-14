import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactRequestSendComponent } from './contact-request-send.component';

import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { RouterStub } from '../../../testing/router-stubs';

import { AuthService } from '../../auth.service';
import { ModelService } from '../../model.service';
import { NotificationsService } from '../../notifications/notifications.service';

import { User } from '../../shared/types';

class ActivatedRouteStub {
  snapshot = { params: {
    username: 'user-contact'
  } };
}

class AuthStubService {
  username = 'user-me';
}

class ModelStubService {
  async readUser(username: string): Promise<User> {
    return { username } as User;
  }

  async sendContactRequestTo(_username: string, _contact) { }
}

@Component({ selector: 'app-contact-form', template: '' })
class ContactFormStubComponent {
  @Input() fields;
  @Input() data;
  @Input() isFormDisabled;
}

@Component({ selector: 'app-contact-overview', template: '' })
class ContactOverviewStubComponent {
  @Input() from;
  @Input() to;
}

describe('ContactRequestSendComponent', () => {
  let component: ContactRequestSendComponent;
  let fixture: ComponentFixture<ContactRequestSendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ContactRequestSendComponent,
        ContactFormStubComponent,
        ContactOverviewStubComponent
      ],
      providers: [
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: ModelService, useClass: ModelStubService },
        { provide: AuthService, useClass: AuthStubService },
        NotificationsService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactRequestSendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('[on successful submit] should redirect to my contacts', async(async () => {
    const router = fixture.debugElement.injector.get(Router);

    const routerSpy = spyOn(router, 'navigate');
    await fixture.whenStable();
    fixture.detectChanges();
    await component.sendRequest({ trust: 3, reference: 'reference', message: 'msg' });
    expect(routerSpy.calls.count()).toEqual(1);

    expect(routerSpy.calls.first().args[0]).toEqual(['/user/user-me/contacts']);
  }));

  it('[on successful submit] should notify about success', async(async () => {
    const notify = fixture.debugElement.injector.get(NotificationsService);

    const notifySpy = spyOn(notify, 'info');
    await fixture.whenStable();
    fixture.detectChanges();
    await component.sendRequest({ trust: 3, reference: 'reference', message: 'msg' });
    expect(notifySpy.calls.count()).toEqual(1);

    expect(notifySpy.calls.first().args[0]).toEqual('Contact request to user-contact was sent.');

  }));
});
