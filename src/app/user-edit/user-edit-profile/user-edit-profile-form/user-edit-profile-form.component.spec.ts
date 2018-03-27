import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEditProfileFormComponent } from './user-edit-profile-form.component';

describe('UserEditProfileFormComponent', () => {
  let component: UserEditProfileFormComponent;
  let fixture: ComponentFixture<UserEditProfileFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserEditProfileFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserEditProfileFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
