/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Observable } from 'rxjs/Observable';
import { MaterialModule } from '@angular/material';

import { UserComponent } from './user.component';

import { ModelService } from '../model.service';

import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AvatarStubComponent } from '../../testing/avatar-stub';

import { AuthService } from '../auth.service';

class ModelStubService {
  lastPromise: Promise<any>;

  readUser(username: string): Promise<any> {
    return this.lastPromise = Promise.resolve({
      username: username,
      givenName: '',
      familyName: '',
      description: ''
    });
  }

  readUserTags(_username: string): Promise<any> {
    return this.lastPromise = Promise.resolve([]);
  }
}

class AuthStubService { }

class ActivatedRouteStub {
  params = Observable.of({ username: 'test-user' });
  data = Observable.of({ user: { username: 'test-user' } });
}

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        UserComponent,
        AvatarStubComponent
      ],
      imports: [
        RouterTestingModule,
        MaterialModule
      ],
      providers: [
        { provide: ModelService, useClass: ModelStubService },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: AuthService, useClass: AuthStubService }
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
