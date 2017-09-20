import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
      .subscribe(({ user, contact }: { user: User|null, contact: { toMe: Contact }|null|'self' }) => {
        this.user = user;

        if (this.user) { // user exists
          switch (contact) {
            case 'self': {
              this.isSelf = true;
              break;
            }
            case null: {
              this.contactStatus = 'nonexistent';
              break;
            }
            default: {
              const { isConfirmed, to: me, creator } = contact.toMe;

              this.contactStatus = (isConfirmed)
                ? 'confirmed'
                : (me.username === creator.username)
                ? 'sent'
                : 'received';
            }
          }
        }
      });
  }
}
