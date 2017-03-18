import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithTagsComponent } from './with-tags.component';

describe('WithTagsComponent', () => {
  let component: WithTagsComponent;
  let fixture: ComponentFixture<WithTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WithTagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
