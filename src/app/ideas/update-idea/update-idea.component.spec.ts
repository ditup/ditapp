import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { UpdateIdeaComponent } from './update-idea.component';
import { EditorOutputComponent } from 'app/shared/editor-output/editor-output.component';
import { FofComponent } from '../../fof/fof.component';
import { AuthService } from '../../auth.service';
import { ModelService } from '../../model.service';
import { NotificationsService } from '../../notifications/notifications.service';

@Component({ selector: 'app-idea-form', template: '' })
class IdeaFormStubComponent {
  @Input() idea;
  @Input() disabled;
  @Input() submitButtonText = 'Submit';
  @Output() submitIdea = new EventEmitter();
}

@Component({ selector: 'app-idea-tag-editor', template: '' })
class IdeaTagEditorStubComponent {
  @Input() tags;
  @Input() idea;
}

class AuthStubService { }
class ModelStubService { }
class ActivatedRouteStub {
  data = Observable.of({
    idea: {
      id: '12345',
      creator: {
        username: 'user-test'
      }
    },
    ideaTags: []
  });
}

describe('UpdateIdeaComponent', () => {
  let component: UpdateIdeaComponent;
  let fixture: ComponentFixture<UpdateIdeaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        IdeaTagEditorStubComponent,
        EditorOutputComponent,
        FofComponent,
        IdeaFormStubComponent,
        UpdateIdeaComponent
      ],
      imports: [
        RouterTestingModule
      ],
      providers: [
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: AuthService, useClass: AuthStubService },
        { provide: ModelService, useClass: ModelStubService },
        NotificationsService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateIdeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
