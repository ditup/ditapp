import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { UserEditLocationComponent } from './user-edit-location.component';

@Component({ selector: 'app-select-location', template: '' })
class SelectLocationStubComponent {
  @Input() location;
}

class ActivatedRouteStub {
  parent = {
    data: Observable.of({ user: {} })
  };
}

describe('UserEditLocationComponent', () => {
  let component: UserEditLocationComponent;
  let fixture: ComponentFixture<UserEditLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        UserEditLocationComponent,
        SelectLocationStubComponent
      ],
      providers: [
        { provide: ActivatedRoute, useClass: ActivatedRouteStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserEditLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
