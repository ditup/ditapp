import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../auth.service';
import { User } from '../../shared/types';

@Component({
  selector: 'app-welcome-start',
  templateUrl: './welcome-start.component.html',
  styleUrls: ['./welcome-start.component.scss']
})
export class WelcomeStartComponent implements OnInit {

  public me: User;

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.me = { username: this.auth.username };
  }

}
