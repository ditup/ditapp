/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MaterialModule } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Observable } from 'rxjs/Observable';

import { UserComponent } from './user.component';
import { FofComponent } from '../fof/fof.component';
import { AvatarStubComponent } from '../../testing/avatar-stub';

import { ModelService } from '../model.service';
import { AuthService } from '../auth.service';

import { User } from '../shared/types';

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
  data = Observable.of({ user: { username: 'test-user' } as User });
}

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        UserComponent,
        AvatarStubComponent,
        FofComponent
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
  });

  describe('user found', () => {

    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('user not found', () => {

    beforeEach(() => {
      const activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
      activatedRoute.data = Observable.of({ user: null });
      fixture.detectChanges();
    });

    it('should show 404 page when user is resolved to null', () => {
      const fof = fixture.debugElement.queryAll(By.css('app-fof'));
      expect(fof.length).toEqual(1);
      expect(fof[0].componentInstance.message).toEqual('user doesn\'t exist');
    });
  });
});
