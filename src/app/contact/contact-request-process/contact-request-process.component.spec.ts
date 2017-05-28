import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactRequestProcessComponent } from './contact-request-process.component';

describe('ContactRequestProcessComponent', () => {
  let component: ContactRequestProcessComponent;
  let fixture: ComponentFixture<ContactRequestProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactRequestProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactRequestProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
