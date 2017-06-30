import { async, ComponentFixture, TestBed } from '@angular/core/testing';


import { Component, Input } from '@angular/core';
import { MaterialModule } from '@angular/material';
import 'hammerjs';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { ProfileComponent } from './profile.component';

import { ModelService } from '../../model.service';
import { AuthService } from '../../auth.service';

/* stubs */
class ModelStubService {
  readUserTags() {}
}

class ActivatedRouteStub {
  data = Observable.of({ user: {} });
}

class AuthStubService { }

@Component({ selector: 'app-user-tag-list', template: '' })
class UserTagListStubComponent {
  @Input() userTags;
  @Input() user;
}

@Component({ selector: 'app-location', template: '' })
class LocationStubComponent {
  @Input() location;
}

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileComponent, UserTagListStubComponent, LocationStubComponent],
      imports: [MaterialModule],
      providers: [
        { provide: ModelService, useClass: ModelStubService },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: AuthService, useClass: AuthStubService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
