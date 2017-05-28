import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactDeleteButtonComponent } from './contact-delete-button.component';

describe('ContactDeleteButtonComponent', () => {
  let component: ContactDeleteButtonComponent;
  let fixture: ComponentFixture<ContactDeleteButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactDeleteButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactDeleteButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
