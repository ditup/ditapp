import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { AuthService } from '../auth.service';
import { ModelService } from '../model.service';

import { Message, User } from '../shared/types';

import * as _ from 'lodash';

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
              private model: ModelService) { }

  ngOnInit() {
    // observe the username parameter
    this.route.params.subscribe(async (params: Params) => {

      try {
        // load the tag from database
        this.otherUserExists = undefined;
        this.loading = true;
        const otherUser: string = params['username'];
        this.otherUser = { username: otherUser } as User;
        this.messages = await this.model.readMessagesWith(otherUser);

        console.log(this.messages);

        this.loading = false;
        this.otherUserExists = true;

        // now mark the messages as read if applicable
        if (this.messages.length > 0) {
          // find the last message i received
          const lastUnreadMsg = _.find(this.messages, (msg: Message) => {
            return msg.from.username === this.otherUser.username && !msg.read;
          });

          if (lastUnreadMsg) {
            console.log('updating last message', lastUnreadMsg);
            const updated = await this.model.updateMessageToRead(lastUnreadMsg);

            console.log('messages updated!', updated);
          }
        }

      } catch (e) {
        this.loading = false;

        console.log(e);
        if (e.status === 404) {
          this.otherUserExists = false;
        } else {
          throw e;
        }
      }
    });
  }

  public onNewMessage(message: Message) {
    console.log('new message sent', message);
    this.messages.unshift(message);
  }

  public get inverseMessages() {
    return _.reverse(this.messages);
  }

}
