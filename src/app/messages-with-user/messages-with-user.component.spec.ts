import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { By } from '@angular/platform-browser';

import { MessagesWithUserComponent } from './messages-with-user.component';

import { FofComponent } from '../fof/fof.component';

import { Component, Input } from '@angular/core';
import { MaterialModule } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { ModelService } from '../model.service';

import { Message, User } from '../shared/types';

@Component({ selector: 'app-message-form', template: '' })
class MessageFormStubComponent {
  @Input() receiver;
}

class ActivatedRouteStub {
  private otherUser = new User({ username: 'other-user' });
  private me = new User({ username: 'me-user' });
  private messages = [
    // unread message from me
    new Message({
      from: this.me,
      to: this.otherUser,
      id: 'msg00',
      body: 'body',
      created: 1500000000010,
      read: false
    }),
    // last unread message to me
    new Message({
      from: this.otherUser,
      to: this.me,
      id: 'msg0',
      body: 'body',
      created: 1500000000010,
      read: false
    }),
    // unread message to me
    new Message({
      from: this.otherUser,
      to: this.me,
      id: 'msg1',
      body: 'body',
      created: 1500000000009,
      read: false
    }),
    // read message to me
    new Message({
      from: this.otherUser,
      to: this.me,
      id: 'msg2',
      body: 'body',
      created: 1500000000008,
      read: true
    }),
    // read message from me
    new Message({
      from: this.me,
      to: this.otherUser,
      id: 'msg3',
      body: 'body',
      created: 1500000000007,
      read: true
    }),
    new Message({
      from: this.otherUser,
      to: this.me,
      id: 'msg4',
      body: 'body',
      created: 1500000000006,
      read: true
    })
  ];

  data = Observable.of({
    messages: this.messages,
    otherUser: this.otherUser
  });
}

class ModelStubService {
  public async updateMessageToRead(_message: Message) {}
}

describe('MessagesWithUserComponent', () => {
  let component: MessagesWithUserComponent;
  let fixture: ComponentFixture<MessagesWithUserComponent>;
  let spyUpdateMessageToRead: jasmine.Spy;

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


    const modelService = fixture.debugElement.injector.get(ModelService);
    spyUpdateMessageToRead = spyOn(modelService, 'updateMessageToRead');


    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show 6 messages', () => {
    const messages = fixture.debugElement.queryAll(By.css('.message'));
    expect(messages.length).toEqual(6);
  });

  it('should send a request to mark last unread message to me (and all the previous ones) as read', () => {
    expect(spyUpdateMessageToRead.calls.count()).toEqual(1);

    const updatedMsg = spyUpdateMessageToRead.calls.first().args[0];

    expect(updatedMsg.id).toEqual('msg0');
  });
});
