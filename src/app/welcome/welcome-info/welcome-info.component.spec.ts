import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { WelcomeInfoComponent } from './welcome-info.component';
import { WelcomeNavigationStubComponent } from '../../../testing/welcome-navigation-stub';

@Component({ selector: 'app-user-edit-profile', template: '' })
class UserEditProfileStubComponent { }

describe('WelcomeInfoComponent', () => {
  let component: WelcomeInfoComponent;
  let fixture: ComponentFixture<WelcomeInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        UserEditProfileStubComponent,
        WelcomeInfoComponent,
        WelcomeNavigationStubComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
