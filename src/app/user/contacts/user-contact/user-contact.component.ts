import { Component, OnInit, Input } from '@angular/core';

import { User, Contact } from '../../../shared/types';

@Component({
  selector: 'app-user-contact',
  templateUrl: './user-contact.component.html',
  styleUrls: ['./user-contact.component.scss']
})
export class UserContactComponent implements OnInit {

  @Input()
  public me: User;

  @Input()
  public contact: Contact;

  constructor() { }

  ngOnInit() {
  }

}
