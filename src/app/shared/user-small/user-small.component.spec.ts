import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSmallComponent } from './user-small.component';

import { MaterialModule } from '@angular/material';

import { ModelService } from '../../model.service';

import { RouterLinkStubDirective } from '../../../testing/router-stubs';

class ModelStubService {
  public readAvatar() {}
}

describe('UserSmallComponent', () => {
  let component: UserSmallComponent;
  let fixture: ComponentFixture<UserSmallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        UserSmallComponent,
        RouterLinkStubDirective
      ],
      imports: [
        MaterialModule
      ],
      providers: [
        { provide: ModelService, useClass: ModelStubService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSmallComponent);
    component = fixture.componentInstance;
    component.user = {
      username: 'test-user'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
