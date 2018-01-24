import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeStartComponent } from './welcome-start.component';
import { AuthService } from '../../auth.service';

class AuthStubService { }

describe('WelcomeStartComponent', () => {
  let component: WelcomeStartComponent;
  let fixture: ComponentFixture<WelcomeStartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WelcomeStartComponent ],
      providers: [
        { provide: AuthService, useClass: AuthStubService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
