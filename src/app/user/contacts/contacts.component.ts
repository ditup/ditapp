import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from '../../auth.service';
import { ModelService } from '../../model.service';

import { User, Contact } from '../../shared/types';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {

  public user: User;
  public isMe: boolean;
  public contacts: Contact[] = [];

  constructor(private auth: AuthService,
              private route: ActivatedRoute,
              private model: ModelService) { }

  ngOnInit() {
    this.route.parent.data
      .subscribe(async ({ user }: { user: User }) => {
        this.user = user;
        this.isMe = this.user.username === this.auth.username;

        // get contacts
        this.contacts = await this.model.readContactsTo(this.user.username);
      });
  }

  public get myUsername() {
    return this.auth.username;
  }

  public get confirmedContacts() {
    return this.contacts
      .filter((contact: Contact) => contact.isConfirmed)
      .sort((a, b) => (a.trust < b.trust)
        ? 1
        : (a.trust === b.trust) ? 0
        : -1);
  }

  public get unconfirmedContacts() {
    return this.contacts.filter((contact: Contact) => !contact.isConfirmed);
  }
}
