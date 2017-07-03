import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Input, Component } from '@angular/core';

import { UserContactComponent } from './user-contact.component';

import { Contact } from '../../../shared/types';
import { RouterLinkStubDirective } from '../../../../testing/router-stubs';

@Component({ selector: 'app-avatar', template: '' })
class AvatarStubComponent {
  @Input() username: string;
}

describe('UserContactComponent', () => {
  let component: UserContactComponent;
  let fixture: ComponentFixture<UserContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        UserContactComponent,
        RouterLinkStubDirective,
        AvatarStubComponent
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserContactComponent);
    component = fixture.componentInstance;
    component.contact = new Contact({
      from: { username: 'user-from' },
      to: { username: 'user-to' },
      isConfirmed: true,
      created: 0
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
