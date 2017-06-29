import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { UserEditLocationComponent } from './user-edit-location.component';

import { ModelService } from '../../model.service';

@Component({ selector: 'app-select-location', template: '' })
class SelectLocationStubComponent {
  @Input() location;
}

class ModelStubService { }

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
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: ModelService, useClass: ModelStubService }
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
