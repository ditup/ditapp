/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FofComponent } from './fof.component';

describe('FofComponent', () => {
  let component: FofComponent;
  let fixture: ComponentFixture<FofComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FofComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FofComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
