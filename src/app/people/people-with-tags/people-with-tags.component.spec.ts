import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleWithTagsComponent } from './people-with-tags.component';

describe('PeopleWithTagsComponent', () => {
  let component: PeopleWithTagsComponent;
  let fixture: ComponentFixture<PeopleWithTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeopleWithTagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeopleWithTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
