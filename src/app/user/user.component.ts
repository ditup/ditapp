import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { User } from 'app/models/user';
import { Contact } from 'app/models/contact';
import * as fromRoot from 'app/reducers';
import { Store, select } from '@ngrx/store';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  public user$: Observable<User | null>;
  public isMe: boolean;
  public avatar: { base64: string, format: string };
  public contactFromMe?: Contact;
  public contactToMe?: Contact;

  public contactStatus: string; // 'confirmed', 'sent', 'received', 'nonexistent'

  constructor(private store: Store<fromRoot.State>) {
    this.user$ = this.store.pipe(select(fromRoot.getRouteUser));
  }

  /*
  get username() {
    return this.user.id;
  }
  */

  ngOnInit() {
    /*
    this.route.data
      .subscribe(async ({ user }: { user: User }) => {
        this.user = user;

        if (this.user) {
          this.isMe = this.username === this.auth.username;

          if (!this.isMe) {
            try {
              this.contactToMe = await this.model.readContact(this.username, this.auth.username);
              this.contactFromMe = await this.model.readContact(this.auth.username, this.username);

              const { isConfirmed, to: me, creator } = this.contactToMe;

              this.contactStatus = (isConfirmed)
                ? 'confirmed'
                : (me.id === creator.id)
                ? 'sent'
                : 'received';

            } catch (e) {
              this.contactStatus = 'nonexistent';
            }
          }
        }
      });
      */
  }
}
