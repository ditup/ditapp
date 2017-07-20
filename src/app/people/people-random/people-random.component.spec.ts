import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleRandomComponent } from './people-random.component';

describe('PeopleRandomComponent', () => {
  let component: PeopleRandomComponent;
  let fixture: ComponentFixture<PeopleRandomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeopleRandomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeopleRandomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
