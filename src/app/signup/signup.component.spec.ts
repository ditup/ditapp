/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialModule } from '../material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable } from 'rxjs/Observable';

import { SignupComponent } from './signup.component';
import { ModelService } from '../model.service';
import { AuthService } from '../auth.service';
import { HeaderControlService } from '../header-control.service';
import { NotificationsService } from '../notifications/notifications.service';

import { User } from '../shared/types';

class RouterStub {
  navigate(url: any[]) { return url.join('/'); }
}

class AuthStubService {
  logged = true;
  logout() {
    this.logged = false;
  }
}

class ModelStubService {
  lastPromise: Promise<any>;

  createUser(newUser: User): Promise<void> {
    newUser; // tslint:disable-line:no-unused-expression
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

describe('SignupComponent', () => {

  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let notifyInfoSpy: jasmine.Spy;

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
        { provide: ModelService, useClass: ModelStubService },
        { provide: AuthService, useClass: AuthStubService },
        HeaderControlService,
        NotificationsService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;

    const notify = fixture.debugElement.injector.get(NotificationsService);
    notifyInfoSpy = spyOn(notify, 'info');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should log out if somebody is logged in, and notify about it', () => {
    const auth = fixture.debugElement.injector.get(AuthService);
    expect(auth.logged).toEqual(false);

    expect(notifyInfoSpy.calls.count()).toEqual(1);
    expect(notifyInfoSpy.calls.argsFor(0)[0]).toEqual('The previous user was logged out.');

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
