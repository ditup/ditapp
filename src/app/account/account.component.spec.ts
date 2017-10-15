import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { AccountComponent } from './account.component';

import { AuthService } from '../auth.service';
import { User } from '../shared/types';

class AuthStubService { }

class ActivatedRouteStub {
  data = Observable.of({ user: { username: 'test-user', email: 'email@example.com' } as User });
}

import { Component } from '@angular/core';
@Component({ selector: 'app-change-email', template: '' })
class ChangeEmailStubComponent { }

@Component({ selector: 'app-change-password', template: '' })
class ChangePasswordStubComponent { }

describe('AccountComponent', () => {
  let component: AccountComponent;
  let fixture: ComponentFixture<AccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AccountComponent,
        ChangeEmailStubComponent,
        ChangePasswordStubComponent
      ],
      providers: [
        { provide: AuthService, useClass: AuthStubService },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
