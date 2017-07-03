import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactRequestProcessComponent } from './contact-request-process.component';

import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { RouterStub } from '../../../testing/router-stubs';

import { ModelService } from '../../model.service';

class ActivatedRouteStub {
  data = Observable.of({ contact: { toMe: { from: {} } } });
}

class ModelStubService { }

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
        { provide: ModelService, useClass: ModelStubService }
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
});
