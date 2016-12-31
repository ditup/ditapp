/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { VerifyEmailComponent } from './verify-email.component';

describe('VerifyEmailComponent', () => {
  let component: VerifyEmailComponent;
  let fixture: ComponentFixture<VerifyEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyEmailComponent ],
      imports: [ReactiveFormsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show a form to provide email verification code', () => {
    const formDebugElement = fixture.debugElement.query(By.css('form'));
    const form = formDebugElement.nativeElement;
    // const inputDebugElement = fixture.debugElement.query(By.css('input[name=code]'));
    // const input = inputDebugElement.nativeElement;
    expect(form).toBeTruthy();
  });

  it('should allow submitting only when code is nonempty', () => {
    pending();
  });

  it('should automatically submit when code provided in url (clicked link in email)', () => {
    pending();
  });

  it('should send the username and verification code to model and save to server on submit', () => {
    pending();
  });
});
