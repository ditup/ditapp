import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { BaseComponent } from './base.component';

@Component({ selector: 'app-header', template: '' })
class HeaderStubComponent { }

describe('BaseComponent', () => {
  let component: BaseComponent;
  let fixture: ComponentFixture<BaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        BaseComponent,
        HeaderStubComponent
      ],
      imports: [
        RouterTestingModule
      ]
    });
    TestBed.compileComponents();
  });

  it('should create', async(() => {
    fixture = TestBed.createComponent(BaseComponent);
    component = fixture.debugElement.componentInstance;
    expect(component).toBeTruthy();
  }));

  describe('logged in with expired token', () => {
    it('redirect to /login');
  });
});
