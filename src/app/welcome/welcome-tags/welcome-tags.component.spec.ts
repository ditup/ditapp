import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { WelcomeTagsComponent } from './welcome-tags.component';
import { WelcomeNavigationStubComponent } from '../../../testing/welcome-navigation-stub';

class ActivatedRouteStub {
  data = Observable.of({ popularTags: [] });
}

@Component({ selector: 'app-tag-list', template: '' })
class TagListStubComponent {
  @Input() tags = [];
  @Input() linksDisabled: boolean;
}

@Component({ selector: 'app-user-edit-tags', template: '' })
class UserEditTagsStubComponent { }

describe('WelcomeTagsComponent', () => {
  let component: WelcomeTagsComponent;
  let fixture: ComponentFixture<WelcomeTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TagListStubComponent,
        UserEditTagsStubComponent,
        WelcomeNavigationStubComponent,
        WelcomeTagsComponent
      ],
      providers: [
        { provide: ActivatedRoute, useClass: ActivatedRouteStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
