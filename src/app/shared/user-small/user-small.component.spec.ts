import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { UserSmallComponent } from './user-small.component';

import { AvatarStubComponent } from '../../../testing/avatar-stub';

describe('UserSmallComponent', () => {
  let component: UserSmallComponent;
  let fixture: ComponentFixture<UserSmallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        UserSmallComponent,
        AvatarStubComponent
      ],
      imports: [
        RouterTestingModule
      ],
      providers: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSmallComponent);
    component = fixture.componentInstance;
    component.user = {
      username: 'test-user'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
