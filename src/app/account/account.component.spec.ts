import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountComponent } from './account.component';

import { AuthService } from '../auth.service';

class AuthStubService { }

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
        { provide: AuthService, useClass: AuthStubService }
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
