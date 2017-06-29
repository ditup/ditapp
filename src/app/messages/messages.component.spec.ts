import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesComponent } from './messages.component';

import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MaterialModule } from '@angular/material';

import { Observable } from 'rxjs/Observable';
import { MomentModule } from 'angular2-moment';

import { RouterLinkStubDirective } from '../../testing/router-stubs';

import { AuthService } from '../auth.service';

class AuthStubService { }

class ActivatedRouteStub {
  data = Observable.of({
    threads: []
  });
}

@Component({ selector: 'app-avatar', template: '' })
class AvatarStubComponent {
  @Input() username;
}

describe('MessagesComponent', () => {
  let component: MessagesComponent;
  let fixture: ComponentFixture<MessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MessagesComponent,
        RouterLinkStubDirective,
        AvatarStubComponent
      ],
      providers: [
        { provide: AuthService, useClass: AuthStubService },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub }
      ],
      imports: [
        MaterialModule,
        MomentModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
