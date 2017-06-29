import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleComponent } from './people.component';

import { Component, Input } from '@angular/core';

import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { RouterStub } from '../../testing/router-stubs';

import { ModelService } from '../model.service';

class ModelStubService { }

class ActivatedRouteStub {
  queryParams = Observable.of({});
  snapshot = {
    queryParams: {}
  }
}

@Component({ selector: 'app-with-my-tags', template: '' })
class WithMyTagsStubComponent {}

@Component({ selector: 'app-with-tags', template: '' })
class WithTagsStubComponent {
  @Input() inputTags;
}

describe('PeopleComponent', () => {
  let component: PeopleComponent;
  let fixture: ComponentFixture<PeopleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PeopleComponent,
        WithMyTagsStubComponent,
        WithTagsStubComponent
      ],
      imports: [
        MaterialModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: ModelService, useClass: ModelStubService },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: Router, useClass: RouterStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
