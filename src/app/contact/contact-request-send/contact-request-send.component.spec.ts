import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactRequestSendComponent } from './contact-request-send.component';

import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { RouterStub } from '../../../testing/router-stubs';

import { AuthService } from '../../auth.service';
import { ModelService } from '../../model.service';

class ActivatedRouteStub {
  snapshot = { params: {} };
}

class AuthStubService { }
class ModelStubService {
  async readUser() {}
}

@Component({ selector: 'app-contact-form', template: '' })
class ContactFormStubComponent {
  @Input() fields;
  @Input() data;
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
        { provide: AuthService, useClass: AuthStubService }
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
});
