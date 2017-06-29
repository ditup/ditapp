import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordUpdateComponent } from './reset-password-update.component';

import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterStub } from '../../testing/router-stubs';

import { ModelService } from '../model.service';

class ModelStubService { }

class ActivatedRouteStub {
  snapshot = {
    params: {
      username: 'username',
      code: 'code'
    }
  }
}

describe('ResetPasswordUpdateComponent', () => {
  let component: ResetPasswordUpdateComponent;
  let fixture: ComponentFixture<ResetPasswordUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetPasswordUpdateComponent ],
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: ModelService, useClass: ModelStubService },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: Router, useClass: RouterStub }
      ]
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
