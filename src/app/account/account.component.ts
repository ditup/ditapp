import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  public username: string;
  public email: string;

  // inject modules, services
  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.username = this.auth.username;
    this.email = this.auth.email;
  }

}
