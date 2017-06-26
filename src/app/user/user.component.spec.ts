/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { RouterModule } from '@angular/router';

import { UserComponent } from './user.component';

import { ModelService } from '../model.service';

import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub } from '../../testing/router-stubs';

import { AuthService } from '../auth.service';
import { BasicAuthService } from '../basic-auth.service';

let activatedRoute: ActivatedRouteStub;

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

  beforeEach(async(() => {
    activatedRoute = new ActivatedRouteStub();

    TestBed.configureTestingModule({
      declarations: [ UserComponent ],
      imports: [RouterModule],
      providers: [
        { provide: ModelService, useClass: FakeModelService },
        { provide: ActivatedRoute, useValue: activatedRoute },
        AuthService,
        BasicAuthService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    activatedRoute.testParams = { username: 'test-user' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
