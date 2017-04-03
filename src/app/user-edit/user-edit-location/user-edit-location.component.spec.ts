import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEditLocationComponent } from './user-edit-location.component';

describe('UserEditLocationComponent', () => {
  let component: UserEditLocationComponent;
  let fixture: ComponentFixture<UserEditLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserEditLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserEditLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
