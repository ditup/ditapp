import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { LoggedComponent } from './logged.component';

import { MaterialModule } from '../../material.module';

describe('LoggedComponent', () => {
  let component: LoggedComponent;
  let fixture: ComponentFixture<LoggedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoggedComponent ],
      imports: [
        MaterialModule,
        RouterTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoggedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
