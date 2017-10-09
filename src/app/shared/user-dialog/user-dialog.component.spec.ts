import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule } from '../../material.module';
import { RouterTestingModule } from '@angular/router/testing';

import { UserDialogComponent } from './user-dialog.component';

import { AvatarStubComponent } from '../../../testing/avatar-stub';
import { UserTagListStubComponent } from '../../../testing/user-tag-list-stub';

describe('UserDialogComponent', () => {
  let component: UserDialogComponent;
  let fixture: ComponentFixture<UserDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        UserDialogComponent,
        AvatarStubComponent,
        UserTagListStubComponent
      ],
      imports: [
        MaterialModule,
        RouterTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDialogComponent);
    component = fixture.componentInstance;

    component.user = { username: 'test-user' };

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
