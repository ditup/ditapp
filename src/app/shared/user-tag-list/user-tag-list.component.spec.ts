import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTagListComponent } from './user-tag-list.component';

describe('UserTagListComponent', () => {
  let component: UserTagListComponent;
  let fixture: ComponentFixture<UserTagListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserTagListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTagListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
