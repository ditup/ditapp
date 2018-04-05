import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { AuthService } from '../auth.service';
import { Message, User } from '../shared/types';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  public messages: Message[];
  public me: User;

  constructor(private auth: AuthService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.me = { id: this.auth.username } as User;

    this.route.data
      .subscribe(({ threads }: { threads: Message[] }) => {
        this.messages = threads;
      });
  }

}
