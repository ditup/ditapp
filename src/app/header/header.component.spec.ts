/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialModule } from '../material.module';

import { Observable } from 'rxjs/Observable';

import { HeaderComponent } from './header.component';

import { HeaderControlService } from '../header-control.service';
import { AuthService } from '../auth.service';
import { ModelService } from '../model.service';

import { RouterLinkStubDirective } from '../../testing/router-stubs';
import { AvatarStubComponent } from '../../testing/avatar-stub';

class AuthStubService {
  loggedStatusChanged$ = Observable.of({});
}

class ModelStubService {
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HeaderComponent,
        AvatarStubComponent,
        RouterLinkStubDirective
      ],
      imports: [
        MaterialModule
      ],
      providers: [
        HeaderControlService,
        { provide: AuthService, useClass: AuthStubService },
        { provide: ModelService, useClass: ModelStubService }
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
