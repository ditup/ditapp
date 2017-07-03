/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NotificationsService } from '../notifications/notifications.service';

import { VerifyEmailComponent } from './verify-email.component';
import { ModelService } from '../model.service';
import { HeaderControlService } from '../header-control.service';
import { ActivatedRouteStub, RouterStub } from '../../testing/router-stubs';

import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

let activatedRoute: ActivatedRouteStub;

class ModelStubService {
  async verifyEmail() { }
}

class HeaderControlStubService {
  displayChanged$;

  display(value: boolean) {
    value; // tslint:disable-line:no-unused-expression
  }

}

describe('VerifyEmailComponent', () => {
  let component: VerifyEmailComponent;
  let fixture: ComponentFixture<VerifyEmailComponent>;

  beforeEach(async(() => {
    activatedRoute = new ActivatedRouteStub();
    TestBed.configureTestingModule({
      declarations: [ VerifyEmailComponent ],
      imports: [ReactiveFormsModule, MaterialModule, BrowserAnimationsModule],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        NotificationsService,
        { provide: HeaderControlService, useClass: HeaderControlStubService },
        { provide: ModelService, useClass: ModelStubService },
        { provide: Router, useClass: RouterStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyEmailComponent);
    component = fixture.componentInstance;
    activatedRoute.testParams = { username: 'test-user' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show a form to provide email verification code', () => {
    const formDebugElement = fixture.debugElement.query(By.css('form'));
    const form = formDebugElement.nativeElement;
    const inputDebugElement = fixture.debugElement.query(By.css('input[formControlName=code]'));
    const input = inputDebugElement.nativeElement;
    expect(form).toBeTruthy();
    expect(input).toBeTruthy();
  });

  it('should allow submitting when code is nonempty', () => {
    // fill the input with a code
    component.verifyEmailForm.controls['code'].setValue('aaaa');
    fixture.detectChanges();

    const buttonDebugElement = fixture.debugElement.query(By.css('button'));
    const button = buttonDebugElement.nativeElement;

    expect(button.hasAttribute('disabled')).toEqual(false);
  });

  it('should not allow submitting when code is empty', () => {
    const buttonDebugElement = fixture.debugElement.query(By.css('button'));
    const button = buttonDebugElement.nativeElement;

    expect(button.hasAttribute('disabled')).toEqual(true);
  });

  it('should automatically submit when code provided in url (clicked link in email)', () => {
    pending();
  });

  it('should send the username and verification code to model and save to server on submit', () => {
    pending();
  });

  it('[good code] should accept the code, inform about success and offer further options', () => {
    pending();
    /*
    const verificationData = {
      username: 'test-user',
      code: '0123456789abcdef0123456789abcdef'
    };
    // fill username to url
    activatedRoute.testParams = { username: verificationData.username };
    // fill code to form
    component.verifyEmailForm.controls['code'].setValue(verificationData.code);

    fixture.detectChanges();

    // submit the form
    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('submit', null);
    fixture.detectChanges();

    const notificationDebugElement = fixture.debugElement.query(By.css('simple-notification'));
    expect(notificationDebugElement).toBeTruthy();

    // const notification = notificationDebugElement.nativeElement;


    // it should say success (find a library for notifications)
    // it should not show the form anymore (redirect to specific url or stay on the same page)
    // it should offer - explore
    //                 - homepage
    //                 - profile
    //                 - log in if not logged in, which will redirect back
    */
  });

  it('[bad code] should complain about wrong code in a notification', () => {
    pending();
  });
});
