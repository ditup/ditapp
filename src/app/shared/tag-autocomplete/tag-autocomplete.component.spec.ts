import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagAutosuggestComponent } from './tag-autosuggest.component';

describe('TagAutosuggestComponent', () => {
  let component: TagAutosuggestComponent;
  let fixture: ComponentFixture<TagAutosuggestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagAutosuggestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagAutosuggestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
