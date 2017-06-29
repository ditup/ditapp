import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectFromMyTagsComponent } from './select-from-my-tags.component';

import { MaterialModule } from '@angular/material';

describe('SelectFromMyTagsComponent', () => {
  let component: SelectFromMyTagsComponent;
  let fixture: ComponentFixture<SelectFromMyTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectFromMyTagsComponent ],
      imports: [
        MaterialModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectFromMyTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
