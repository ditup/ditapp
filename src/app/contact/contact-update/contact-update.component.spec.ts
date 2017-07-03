import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactUpdateComponent } from './contact-update.component';

import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { RouterStub } from '../../../testing/router-stubs';

import { ModelService } from '../../model.service';

class ActivatedRouteStub {
  data = Observable.of({ contact: { fromMe: {} } });
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
        { provide: ModelService, useClass: ModelStubService }
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
});
