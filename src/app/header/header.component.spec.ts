/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Component, Input } from '@angular/core';
import { MaterialModule } from '@angular/material';

import { Observable } from 'rxjs/Observable';

import { HeaderComponent } from './header.component';

import { HeaderControlService } from '../header-control.service';
import { AuthService } from '../auth.service';
import { ModelService } from '../model.service';

import { RouterLinkStubDirective } from '../../testing/router-stubs';

class AuthStubService {
  loggedStatusChanged$ = Observable.of({});
}

class ModelStubService {
}

@Component({ selector: 'app-avatar', template: '' })
class AvatarStubComponent {
  @Input() username;
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HeaderComponent,
        AvatarStubComponent,
        RouterLinkStubDirective
      ],
      imports: [
        MaterialModule
      ],
      providers: [
        HeaderControlService,
        { provide: AuthService, useClass: AuthStubService },
        { provide: ModelService, useClass: ModelStubService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
