import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactRequestUpdateComponent } from './contact-request-update.component';

describe('ContactRequestUpdateComponent', () => {
  let component: ContactRequestUpdateComponent;
  let fixture: ComponentFixture<ContactRequestUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactRequestUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactRequestUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
