import { Component, OnInit } from '@angular/core';

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
  public loading: boolean;

  constructor(private model: ModelService, private auth: AuthService) { }

  async ngOnInit() {
    this.loading = true;

    this.me = new User({ username: this.auth.username });
    this.messages = await this.model.readThreads();

    this.loading = false;
  }

}
