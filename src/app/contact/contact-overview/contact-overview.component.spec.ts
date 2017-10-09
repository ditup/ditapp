import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactOverviewComponent } from './contact-overview.component';

import { Component, Input } from '@angular/core';
import { MaterialModule } from '../../material.module';

@Component({ selector: 'app-user-card', template: '' })
class UserCardStubComponent {
  @Input() user;
}

describe('ContactOverviewComponent', () => {
  let component: ContactOverviewComponent;
  let fixture: ComponentFixture<ContactOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ContactOverviewComponent,
        UserCardStubComponent
      ],
      imports: [
        MaterialModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
