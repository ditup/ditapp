/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NotificationsService } from '../notifications/notifications.service';

import { LoginBasicComponent } from './login-basic.component';
import { ModelService } from '../model.service';
import { AuthService } from '../auth.service';
import { HeaderControlService } from '../header-control.service';

import { RouterStub } from '../../testing/router-stubs';

class ModelStubService {
  async basicAuth() {}
}

class ActivatedRouteStub {
  snapshot = {
    queryParams: {}
  };
}

class AuthStubService {}

describe('LoginBasicComponent', () => {
  let component: LoginBasicComponent;
  let fixture: ComponentFixture<LoginBasicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginBasicComponent],
      imports: [
        ReactiveFormsModule,
        MaterialModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: Router, useClass: RouterStub },
        { provide: ModelService, useClass: ModelStubService },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: AuthService, useClass: AuthStubService },
        NotificationsService,
        HeaderControlService,
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
