import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordUpdateComponent } from './reset-password-update.component';

describe('ResetPasswordUpdateComponent', () => {
  let component: ResetPasswordUpdateComponent;
  let fixture: ComponentFixture<ResetPasswordUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetPasswordUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
