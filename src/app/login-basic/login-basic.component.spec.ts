/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { NotificationsService } from 'angular2-notifications';

import { LoginBasicComponent } from './login-basic.component';
import { ModelService } from '../model.service';
import { BasicAuthService } from '../basic-auth.service';

class FakeModelService {
  basicAuth() {
    return Promise.resolve();
  }
}

class NotificationsServiceStub {
  info() {
    return { id: 'info' };
  }

  success() {
    return { id: 'success' };
  }

  error() {
    return { id: 'error' };
  }

  remove() {}
}

describe('LoginBasicComponent', () => {
  let component: LoginBasicComponent;
  let fixture: ComponentFixture<LoginBasicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginBasicComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: ModelService, useClass: FakeModelService },
        { provide: NotificationsService, useClass: NotificationsServiceStub },
        BasicAuthService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
