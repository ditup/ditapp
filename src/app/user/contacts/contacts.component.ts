import { Component, OnInit } from '@angular/core';

import { User } from 'app/models/user';
import { Contact } from 'app/models/contact';
import { Observable } from 'rxjs/Observable';
import * as fromRoot from 'app/reducers';
import { Store, select } from '@ngrx/store';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {

  public user$: Observable<User>;
  public me$: Observable<User>;
  public isMe: boolean;
  public contacts: Contact[] = [];

  constructor(private store: Store<fromRoot.State>) {
    this.user$ = this.store.pipe(select(fromRoot.getRouteUser));
    this.me$ = this.store.pipe(select(fromRoot.getAuthUser));
  }

  ngOnInit() {
  }

  /*
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
  */
}
