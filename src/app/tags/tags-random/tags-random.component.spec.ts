import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsRandomComponent } from './tags-random.component';

describe('TagsRandomComponent', () => {
  let component: TagsRandomComponent;
  let fixture: ComponentFixture<TagsRandomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagsRandomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsRandomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
