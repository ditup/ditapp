import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { Observable } from 'rxjs/Observable';

import { ModelService } from '../../model.service';
import { DialogService } from '../../dialog.service';

import { UserEditProfileComponent } from './user-edit-profile.component';

class ModelStubService { }

class ActivatedRouteStub {
  parent = {
    data: Observable.of({ user: {} })
  };
}

describe('UserEditProfileComponent', () => {
  let component: UserEditProfileComponent;
  let fixture: ComponentFixture<UserEditProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserEditProfileComponent ],
      imports: [
        ReactiveFormsModule,
        MaterialModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: ModelService, useClass: ModelStubService },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        DialogService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserEditProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
