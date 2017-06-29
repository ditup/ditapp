/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';

import { Observable } from 'rxjs/Observable';

import { UserEditComponent } from './user-edit.component';

import { ModelService } from '../model.service';
import { DialogService } from '../dialog.service';

import { ActivatedRoute } from '@angular/router';
import { RouterLinkStubDirective, RouterLinkActiveStubDirective, RouterOutletStubComponent } from '../../testing/router-stubs';
import { User } from '../shared/types';

class ActivatedRouteStub {
  data = Observable.of({ user: {} });
}

class FakeModelService {
  lastPromise: Promise<any>;

  createUser(newUser: User): Promise<void> {
    return this.lastPromise = Promise.resolve();
  }

  readUser(username: string): Promise<any> {
    return this.lastPromise = Promise.resolve({
      username: username,
      givenName: '',
      familyName: '',
      description: ''
    });
  }

  updateUser(username: string, profile: any): Promise<any> {
    return this.lastPromise = Promise.resolve({
      username: username,
      givenName: '',
      familyName: '',
      description: ''
    });
  }

}

describe('UserEditComponent', () => {
  let component: UserEditComponent;
  let fixture: ComponentFixture<UserEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        UserEditComponent,
        RouterLinkStubDirective,
        RouterLinkActiveStubDirective,
        RouterOutletStubComponent
      ],
      imports: [ReactiveFormsModule, MaterialModule],
      providers: [
        { provide: ModelService, useClass: FakeModelService },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        DialogService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
