/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { UserComponent } from './user.component';

import { ModelService } from '../model.service';

import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteStub, RouterStub } from '../../testing/router-stubs';
import { AvatarStubComponent } from '../../testing/avatar-stub';

import { AuthService } from '../auth.service';
import { BasicAuthService } from '../basic-auth.service';

class FakeModelService {
  lastPromise: Promise<any>;

  readUser(username: string): Promise<any> {
    return this.lastPromise = Promise.resolve({
      username: username,
      givenName: '',
      familyName: '',
      description: ''
    });
  }

  readUserTags(username: string): Promise<any> {
    return this.lastPromise = Promise.resolve([]);
  }
}

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;

  const activatedRouteStub = {
    params: Observable.of({ username: 'test-user' }),
    data: Observable.of({ user: { username: 'test-user' } })
  }

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [UserComponent, AvatarStubComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: ModelService, useClass: FakeModelService },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        AuthService,
        BasicAuthService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
