/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable } from 'rxjs/Observable';

import { SignupComponent } from './signup.component';
import { ModelService } from '../model.service';
import { HeaderControlService } from '../header-control.service';
import { NotificationsService } from '../notifications/notifications.service';

import { User } from '../shared/types';

class RouterStub {
  navigate(url: any[]) { return url.join('/'); }
}

class FakeModelService {
  lastPromise: Promise<any>;

  createUser(newUser: User): Promise<void> {
    return this.lastPromise = Promise.resolve();
  }

  isUsernameAvailable(username: string): Observable<boolean> {
    return new Observable(observer => {
      if (username === 'existent-user') {
        observer.next(false);
      } else {
        observer.next(true);
      }
    });
  }
}

class FakeHeaderControlService {
  displayChanged$;

  display(value: boolean) {}

}

describe('SignupComponent', () => {

  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupComponent ],
      imports: [
        ReactiveFormsModule,
        MaterialModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: Router, useClass: RouterStub },
        { provide: ModelService, useClass: FakeModelService },
        { provide: HeaderControlService, useClass: FakeHeaderControlService },
        NotificationsService
      ]
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
