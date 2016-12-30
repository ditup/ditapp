/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { SignupComponent } from './signup.component';
import { ModelService } from '../model.service';

import { NewUser } from '../new-user';

class RouterStub {
  navigate(url: Array) { return url.join('/'); }
}

class FakeModelService implements ModelService {
  lastPromise: Promise<any>;

  createUser(newUser: NewUser): Promise<void> {
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


fdescribe('SignupComponent', () => {

  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupComponent ],
      imports: [
        ReactiveFormsModule,
      ],
      providers: [
        { provide: Router, useClass: RouterStub },
        { provide: ModelService, useClass: FakeModelService }
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
