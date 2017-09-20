import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { has } from 'lodash';

import { Contact, User } from '../../shared/types';

@Component({
  selector: 'app-manage-contact',
  templateUrl: './manage-contact.component.html',
  styleUrls: ['./manage-contact.component.scss']
})
export class ManageContactComponent implements OnInit {

  public contactStatus: string;
  public isSelf: boolean;
  public user: User;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data
      .subscribe((data: { user: User, contact: { toMe: Contact } } | { user: User, contact: null } | { user: null, contact: null }) => {
        this.user = data.user;

        if (this.user) {
          if (has(data, 'contact.toMe')) {
            const { isConfirmed, to: me, creator } = data.contact.toMe;

            this.contactStatus = (isConfirmed)
              ? 'confirmed'
              : (me.username === creator.username)
              ? 'sent'
              : 'received';

          } else {
            this.contactStatus = 'nonexistent';
          }
        }
      });
  }
}
