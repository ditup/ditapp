import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageContactComponent } from './manage-contact.component';

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';

class ActivatedRouteStub {
  data = Observable.of({ contact: {} });
}

@Component({ selector: 'app-fof', template: '' })
class FofStubComponent {}

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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ManageContactComponent,
        FofStubComponent,
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
