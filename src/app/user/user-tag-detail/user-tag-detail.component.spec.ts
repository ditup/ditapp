import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTagDetailComponent } from './user-tag-detail.component';

describe('UserTagDetailComponent', () => {
  let component: UserTagDetailComponent;
  let fixture: ComponentFixture<UserTagDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserTagDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTagDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
