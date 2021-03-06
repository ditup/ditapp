import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTagDetailComponent } from './user-tag-detail.component';
import { EditorOutputComponent } from '../editor-output/editor-output.component';

import { MaterialModule } from '../../material.module';

import { RouterLinkStubDirective } from '../../../testing/router-stubs';

describe('UserTagDetailComponent', () => {
  let component: UserTagDetailComponent;
  let fixture: ComponentFixture<UserTagDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        UserTagDetailComponent,
        RouterLinkStubDirective,
        EditorOutputComponent
      ],
      imports: [
        MaterialModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTagDetailComponent);
    component = fixture.componentInstance;
    component.userTag = {
      user: { username: 'test-user' },
      tag: { tagname: 'test-tag' },
      story: '',
      relevance: 4
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
