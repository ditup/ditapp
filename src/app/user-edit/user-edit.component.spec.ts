/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { UserEditComponent } from './user-edit.component';

import { ModelService } from '../model.service';
import { DialogService } from '../dialog.service';

import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub } from '../../testing/router-stubs';

let activatedRoute: ActivatedRouteStub;

class FakeModelService implements ModelService {
  lastPromise: Promise<any>;

  createUser(newUser: NewUser): Promise<void> {
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
      username: username
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
    activatedRoute = new ActivatedRouteStub();

    TestBed.configureTestingModule({
      declarations: [ UserEditComponent ],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: ModelService, useClass: FakeModelService }
        { provide: ActivatedRoute, useValue: activatedRoute },
        DialogService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserEditComponent);
    component = fixture.componentInstance;
    activatedRoute.testParams = { username: 'test-user' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
