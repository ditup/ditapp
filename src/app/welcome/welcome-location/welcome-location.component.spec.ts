import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { WelcomeLocationComponent } from './welcome-location.component';
import { WelcomeNavigationStubComponent } from '../../../testing/welcome-navigation-stub';

@Component({ selector: 'app-user-edit-location', template: '' })
class UserEditLocationStubComponent { }

describe('WelcomeLocationComponent', () => {
  let component: WelcomeLocationComponent;
  let fixture: ComponentFixture<WelcomeLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        UserEditLocationStubComponent,
        WelcomeLocationComponent,
        WelcomeNavigationStubComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
