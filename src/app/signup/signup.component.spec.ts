/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SignupComponent } from './signup.component';

fdescribe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show an empty signup form', () => {
    pending();
  });
  it('should have the submit button invalid at the beginning', () => {
    pending();
  });
  it('should show error when invalid username is provided', () => {
    pending();
  });
  it('should show error when invalid email is provided', () => {
    pending();
  });
  it('should show error when invalid password is provided', () => {
    pending();
  });
  it('should show error when username exists already', () => {
    pending();
  });
  it('should make submit button active when all data are valid', () => {
    pending();
  });
  it('should accept the valid data and redirect to email validation page on success (201)', () => {
    pending();
  });
});
