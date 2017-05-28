import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ModelService } from '../model.service';
import { AuthService } from '../auth.service';
import { UserTag, User, Contact } from '../shared/types';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  public username: string;
  public user: any;
  public isMe: boolean;
  public avatar: { base64: string, format: string };
  public contactFromMe?: Contact;
  public contactToMe?: Contact;

  public contactStatus: string; // 'confirmed', 'sent', 'received', 'nonexistent'



  constructor(private model: ModelService,
              private route: ActivatedRoute,
              private auth: AuthService
             ) { }

  ngOnInit() {
    this.route.data
      .subscribe(async ({ user }: { user: User }) => {
        this.username = user.username;
        this.user = user;
        this.isMe = this.username === this.auth.username;

        if (!this.isMe) {
          try {
            this.contactToMe = await this.model.readContact(this.username, this.auth.username);
            this.contactFromMe = await this.model.readContact(this.auth.username, this.username);

            const { isConfirmed, to: me, creator } = this.contactToMe;

            this.contactStatus = (isConfirmed)
              ? 'confirmed'
              : (me.username === creator.username)
              ? 'sent'
              : 'received';

          } catch (e) {
            this.contactStatus = 'nonexistent';
          }
        }

        // get avatar and assign it to this.avatar
        this.avatar = await this.model.readAvatar(this.username);
      });
  }
}
