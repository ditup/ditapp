import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleNewComponent } from './people-new.component';

describe('PeopleNewComponent', () => {
  let component: PeopleNewComponent;
  let fixture: ComponentFixture<PeopleNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeopleNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeopleNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
