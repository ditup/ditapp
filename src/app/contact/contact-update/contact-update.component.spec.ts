import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactUpdateComponent } from './contact-update.component';

import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { RouterStub } from '../../../testing/router-stubs';

import { ModelService } from '../../model.service';
import { NotificationsService } from '../../notifications/notifications.service';

class ActivatedRouteStub {
  data = Observable.of({
    contact: {
      fromMe: { from: { username: 'user-me' }, to: { username: 'other-user' } }
    }
  });
}

class ModelStubService {
  async updateContactWith(_username, _data) { }
}

@Component({ selector: 'app-contact-form', template: '' })
class ContactFormStubComponent {
  @Input() fields;
  @Input() data;
  @Input() isFormDisabled;
}

@Component({ selector: 'app-contact-delete-button', template: '' })
class ContactDeleteButtonStubComponent {
  @Input() with;
}

@Component({ selector: 'app-contact-overview', template: '' })
class ContactOverviewStubComponent {
  @Input() from;
  @Input() to;
}

describe('ContactUpdateComponent', () => {
  let component: ContactUpdateComponent;
  let fixture: ComponentFixture<ContactUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ContactUpdateComponent,
        ContactFormStubComponent,
        ContactDeleteButtonStubComponent,
        ContactOverviewStubComponent
      ],
      providers: [
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: ModelService, useClass: ModelStubService },
        NotificationsService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('[on successful update] should redirect to my contacts', async(async () => {
    const router = fixture.debugElement.injector.get(Router);

    const routerSpy = spyOn(router, 'navigate');

    await component.updateContact({ trust: 3, reference: 'reference' });
    expect(routerSpy.calls.count()).toEqual(1);

    expect(routerSpy.calls.first().args[0]).toEqual(['/user/user-me/contacts']);

  }));

  it('[on successful update] should notify about success', async(async () => {
    const notify = fixture.debugElement.injector.get(NotificationsService);

    const notifySpy = spyOn(notify, 'info');
    await component.updateContact({ trust: 3, reference: 'reference' });
    expect(notifySpy.calls.count()).toEqual(1);

    expect(notifySpy.calls.first().args[0]).toEqual('Contact with other-user was updated.');
  }));

});
