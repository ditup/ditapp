import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { CreateIdeaComponent } from './create-idea.component';
import { ModelService } from '../../model.service';
import { NotificationsService } from 'app/notifications/notifications.service';

@Component({ selector: 'app-idea-form', template: '' })
class IdeaFormStubComponent {
  @Input() idea;
  @Input() submitButtonText = 'Submit';
  @Output() submitIdea = new EventEmitter();
}

class ModelStubService {
  createIdea() { }
}

describe('CreateIdeaComponent', () => {
  let component: CreateIdeaComponent;
  let fixture: ComponentFixture<CreateIdeaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CreateIdeaComponent,
        IdeaFormStubComponent
      ],
      imports: [
        RouterTestingModule
      ],
      providers: [
        { provide: ModelService, useClass: ModelStubService },
        NotificationsService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateIdeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
