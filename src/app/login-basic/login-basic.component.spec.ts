/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { NotificationsService } from 'angular2-notifications';

import { LoginBasicComponent } from './login-basic.component';
import { ModelService } from '../model.service';
import { BasicAuthService } from '../basic-auth.service';
import { AuthService } from '../auth.service';
import { HeaderControlService } from '../header-control.service';

import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub } from '../../testing/router-stubs';

let activatedRoute: ActivatedRouteStub;

class FakeModelService {
  basicAuth() {
    return Promise.resolve();
  }
}

class FakeHeaderControlService implements HeaderControlService {
  display(value: boolean) {}
}

class RouterStub {
  navigate(url: Array) { return url.join('/'); }
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
        { provide: Router, useClass: RouterStub },
        { provide: ModelService, useClass: FakeModelService },
        { provide: NotificationsService, useClass: NotificationsServiceStub },
        { provide: ActivatedRoute, useValue: activatedRoute }
        { provide: HeaderControlService, useClass: FakeHeaderControlService }
        BasicAuthService,
        AuthService
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
