import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesWithUserComponent } from './messages-with-user.component';

describe('MessagesWithUserComponent', () => {
  let component: MessagesWithUserComponent;
  let fixture: ComponentFixture<MessagesWithUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessagesWithUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagesWithUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
