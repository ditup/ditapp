import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { find } from 'lodash';

import { FooterControlService } from '../footer/footer-control.service';
import { ModelService } from '../model.service';
import { Message, User } from '../shared/types';

@Component({
  selector: 'app-messages-with-user',
  templateUrl: './messages-with-user.component.html',
  styleUrls: ['./messages-with-user.component.scss']
})
export class MessagesWithUserComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('messagesList')
  private messagesList: ElementRef;

  public loading = false;
  public messages: Message[];
  public otherUserExists: boolean;

  public otherUser: User;

  constructor(private footerControl: FooterControlService,
              private route: ActivatedRoute,
              private model: ModelService) { }

  ngOnInit() {
    // observe the username parameter
    this.route.data.subscribe(async ({ messages, otherUser }: { messages: Message[], otherUser: User }) => {
      // reverse mutates the original array
      // but we want to keep the original to find the newest unread message
      // therefore we use slice to clone the array
      this.messages = messages.slice().reverse();

      this.otherUserExists = true;

      this.otherUser = otherUser;

      // now mark the messages as read if applicable
      if (messages.length > 0) {
        // find the last message i received
        const lastUnreadMsg = find(messages, (msg: Message) => {
          return msg.from.username === this.otherUser.username && !msg.read;
        });

        if (lastUnreadMsg) {
          await this.model.updateMessageToRead(lastUnreadMsg);
        }
      }
    }, (e) => {
      if (e.status === 404) {
        this.otherUserExists = false;
      } else {
        throw e;
      }
    });

    // hide the footer
    this.footerControl.display(false);
  }

  ngAfterViewInit() {
    this.scrollMessagesToBottom();
  }

  ngOnDestroy() {
    // show the footer again
    this.footerControl.display(true);
  }

  public onNewMessage(message: Message) {
    console.log('new message sent', message);
    this.messages.push(message);
    this.scrollMessagesToBottom();
  }

  private scrollMessagesToBottom() {
    const element =  this.messagesList.nativeElement;
    element.scrollTop = element.scrollHeight;
  }
}
