import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';

import { ManageContactComponent } from './manage-contact.component';
import { FofComponent } from '../../fof/fof.component';

class ActivatedRouteStub {
  data = Observable.of({ contact: { }, user: { username: 'other-user' } });
}

@Component({ selector: 'app-contact-request-send', template: '' })
class ContactRequestSendStubComponent {}

@Component({ selector: 'app-contact-request-update', template: '' })
class ContactRequestUpdateStubComponent {}

@Component({ selector: 'app-contact-request-process', template: '' })
class ContactRequestProcessStubComponent {}

@Component({ selector: 'app-contact-update', template: '' })
class ContactUpdateStubComponent {}

describe('ManageContactComponent', () => {
  let component: ManageContactComponent;
  let fixture: ComponentFixture<ManageContactComponent>;
  let activatedRoute: ActivatedRouteStub;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ManageContactComponent,
        FofComponent,
        ContactRequestSendStubComponent,
        ContactRequestUpdateStubComponent,
        ContactRequestProcessStubComponent,
        ContactUpdateStubComponent
      ],
      providers: [
        { provide: ActivatedRoute, useClass: ActivatedRouteStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageContactComponent);
    component = fixture.componentInstance;
    activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
  });

  describe('user exists', () => {

    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('user doesn\'t exist', () => {
    beforeEach(() => {
      activatedRoute.data = Observable.of({ contact: null, user: null });
      fixture.detectChanges();
    });

    it('should show 404 page when other user doesn\'t exist', () => {
      const fof = fixture.debugElement.queryAll(By.css('app-fof'));

      expect(fof.length).toEqual(1);
      expect(fof[0].componentInstance.message).toEqual('user doesn\'t exist');
    });
  });
});
