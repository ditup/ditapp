import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { ContactsComponent } from './contacts.component';
import { AuthService } from '../../auth.service';
import { ModelService } from '../../model.service';

class AuthStubService { }

class ModelStubService { }

class ActivatedRouteStub {
  parent = {
    data: Observable.of({ user: {} })
  }
}

@Component({ selector: 'app-user-contact', template: '' })
class UserContactStubComponent {
  @Input() contact;
  @Input() me;
}


describe('ContactsComponent', () => {
  let component: ContactsComponent;
  let fixture: ComponentFixture<ContactsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ContactsComponent,
        UserContactStubComponent
      ],
      providers: [
        { provide: AuthService, useClass: AuthStubService },
        { provide: ModelService, useClass: ModelStubService },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
