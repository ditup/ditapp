import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { ModelService } from '../model.service';
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
    this.me = new User({ username: this.auth.username });

    this.route.data
      .subscribe(({ threads }: { threads: Message[] }) => {
        this.messages = threads;
      });
  }

}
