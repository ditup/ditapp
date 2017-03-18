import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithMyTagsComponent } from './with-my-tags.component';

describe('WithMyTagsComponent', () => {
  let component: WithMyTagsComponent;
  let fixture: ComponentFixture<WithMyTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WithMyTagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithMyTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
