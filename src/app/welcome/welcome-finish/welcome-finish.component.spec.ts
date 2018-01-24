import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeFinishComponent } from './welcome-finish.component';

describe('WelcomeFinishComponent', () => {
  let component: WelcomeFinishComponent;
  let fixture: ComponentFixture<WelcomeFinishComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WelcomeFinishComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeFinishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
