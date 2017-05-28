import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactOverviewComponent } from './contact-overview.component';

describe('ContactOverviewComponent', () => {
  let component: ContactOverviewComponent;
  let fixture: ComponentFixture<ContactOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactOverviewComponent ]
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
