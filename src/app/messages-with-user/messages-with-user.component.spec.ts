import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesWithUserComponent } from './messages-with-user.component';

import { FofComponent } from '../fof/fof.component';

import { Component, Input } from '@angular/core';
import { MaterialModule } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { ModelService } from '../model.service';

@Component({ selector: 'app-message-form', template: '' })
class MessageFormStubComponent {
  @Input() receiver;
}

class ActivatedRouteStub {
  data = Observable.of({
    messages: []
  });
}

class ModelStubService { }

describe('MessagesWithUserComponent', () => {
  let component: MessagesWithUserComponent;
  let fixture: ComponentFixture<MessagesWithUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MessagesWithUserComponent,
        MessageFormStubComponent,
        FofComponent
      ],
      imports: [
        MaterialModule
      ],
      providers: [
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: ModelService, useClass: ModelStubService }
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagesWithUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
