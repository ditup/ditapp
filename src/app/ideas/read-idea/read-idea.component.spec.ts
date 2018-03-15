import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ReadIdeaComponent } from './read-idea.component';
import { EditorOutputComponent } from 'app/shared/editor-output/editor-output.component';
import { MaterialModule } from 'app/material.module';
import { AuthService } from 'app/auth.service';
import { ModelService } from 'app/model.service';
import { UserSmallStubComponent } from 'app/shared/user-small/user-small.component';
import { CommentsStubComponent } from 'app/comments/comments.component';
import { VoteStubComponent } from 'app/shared/vote/vote.component';

@Component({ selector: 'app-tag-list', template: '' })
class TagListStubComponent {
  @Input() tags;
}

class AuthStubService {
  username = 'user';
}

class ModelStubService { }

class ActivatedRouteStub {
  data = Observable.of({
    idea: { id: '123', creator: { username: 'user' } },
    ideaTags: []
  });
}

describe('ReadIdeaComponent', () => {
  let component: ReadIdeaComponent;
  let fixture: ComponentFixture<ReadIdeaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CommentsStubComponent,
        EditorOutputComponent,
        ReadIdeaComponent,
        TagListStubComponent,
        UserSmallStubComponent,
        VoteStubComponent
      ],
      imports: [
        MaterialModule,
        RouterTestingModule
      ],
      providers: [
        { provide: AuthService, useClass: AuthStubService },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: ModelService, useClass: ModelStubService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadIdeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
