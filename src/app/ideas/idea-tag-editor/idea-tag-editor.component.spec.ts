import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';

import { IdeaTagEditorComponent } from './idea-tag-editor.component';
import { ModelService } from 'app/model.service';
import { NotificationsService } from 'app/notifications/notifications.service';

@Component({ selector: 'app-edit-tags', template: '' })
class EditTagsStubComponent {
  @Input() tags;
}

class ModelStubService { }

describe('IdeaTagEditorComponent', () => {
  let component: IdeaTagEditorComponent;
  let fixture: ComponentFixture<IdeaTagEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditTagsStubComponent,
        IdeaTagEditorComponent
      ],
      providers: [
        { provide: ModelService, useClass: ModelStubService },
        NotificationsService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdeaTagEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
