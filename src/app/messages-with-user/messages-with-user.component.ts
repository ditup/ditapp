import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { AuthService } from '../auth.service';
import { ModelService } from '../model.service';

import { Message, User } from '../shared/types';

import { find, reverse } from 'lodash';

@Component({
  selector: 'app-messages-with-user',
  templateUrl: './messages-with-user.component.html',
  styleUrls: ['./messages-with-user.component.scss']
})
export class MessagesWithUserComponent implements OnInit {

  public loading: boolean = false;
  public messages: Message[];
  public otherUserExists: boolean;

  public otherUser: User;

  constructor(private route: ActivatedRoute,
              private auth: AuthService,
              private model: ModelService) { }

  ngOnInit() {
    // observe the username parameter
    this.route.data.subscribe(async ({ messages }: { messages: Message[] }) => {
      this.messages = messages;

      console.log(this.messages, this.inverseMessages);

      this.otherUserExists = true;

      if (this.messages.length > 0) {
        this.otherUser = this.messages[0].with({ username: this.auth.username } as User);
      } else {
        this.otherUser = { username: this.route.snapshot['username'] } as User;
      }

      // now mark the messages as read if applicable
      if (this.messages.length > 0) {
        // find the last message i received
        const lastUnreadMsg = find(this.messages, (msg: Message) => {
          return msg.from.username === this.otherUser.username && !msg.read;
        });

        if (lastUnreadMsg) {
          const updated = await this.model.updateMessageToRead(lastUnreadMsg);
        }
      }
    }, (e) => {
      if (e.status === 404) {
        this.otherUserExists = false;
      } else {
        throw e;
      }
    });
  }

  public onNewMessage(message: Message) {
    console.log('new message sent', message);
    this.messages.unshift(message);
  }

  public get inverseMessages() {
    return reverse(this.messages);
  }

}
