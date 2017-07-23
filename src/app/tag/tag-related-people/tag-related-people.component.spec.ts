import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagRelatedPeopleComponent } from './tag-related-people.component';

describe('TagRelatedPeopleComponent', () => {
  let component: TagRelatedPeopleComponent;
  let fixture: ComponentFixture<TagRelatedPeopleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagRelatedPeopleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagRelatedPeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
