import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactRequestProcessComponent } from './contact-request-process.component';

import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { RouterStub } from '../../../testing/router-stubs';

import { ModelService } from '../../model.service';
import { NotificationsService } from '../../notifications/notifications.service';

class ActivatedRouteStub {
  data = Observable.of({ contact: { toMe: { from: { username: 'other-user' }, to: { username: 'user-me' } } } });
}

class ModelStubService {
  async confirmContactRequestFrom(_username: string, _data: { trust: number, reference: string }): Promise<void> { }
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

describe('ContactRequestProcessComponent', () => {
  let component: ContactRequestProcessComponent;
  let fixture: ComponentFixture<ContactRequestProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ContactRequestProcessComponent,
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
    fixture = TestBed.createComponent(ContactRequestProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('[on accept success] should navigate to my contacts', async(async () => {
    const router = fixture.debugElement.injector.get(Router);

    const routerSpy = spyOn(router, 'navigate');

    await component.confirmContact({ trust: 3, reference: 'reference' });
    expect(routerSpy.calls.count()).toEqual(1);

    expect(routerSpy.calls.first().args[0]).toEqual(['/user/user-me/contacts']);

  }));

  it('[on accept success] should notify about the success', async(async () => {
    const notify = fixture.debugElement.injector.get(NotificationsService);

    const notifySpy = spyOn(notify, 'info');
    await fixture.whenStable();
    fixture.detectChanges();
    await component.confirmContact({ trust: 3, reference: 'reference', message: 'msg' });
    expect(notifySpy.calls.count()).toEqual(1);

    expect(notifySpy.calls.first().args[0]).toEqual('Contact with other-user was confirmed.');
  }));
});
