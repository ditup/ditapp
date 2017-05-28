import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactRequestSendComponent } from './contact-request-send.component';

describe('ContactRequestSendComponent', () => {
  let component: ContactRequestSendComponent;
  let fixture: ComponentFixture<ContactRequestSendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactRequestSendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactRequestSendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
