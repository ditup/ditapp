/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Observable } from 'rxjs';

import { HeaderComponent } from './header.component';

import { HeaderControlService } from '../header-control.service';
import { AuthService } from '../auth.service';
import { BasicAuthService } from '../basic-auth.service';

class FakeHeaderControlService implements HeaderControlService {
  displayChanged$: Observable<boolean> = new Observable(observer => observer.next(false));

  display(value: boolean) {}

}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderComponent ],
      imports: [RouterModule],
      providers: [
        { provide: HeaderControlService, useClass: FakeHeaderControlService },
        AuthService,
        BasicAuthService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
