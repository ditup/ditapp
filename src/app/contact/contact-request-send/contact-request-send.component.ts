import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ModelService } from '../../model.service';
import { AuthService } from '../../auth.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { User } from '../../shared/types';

@Component({
  selector: 'app-contact-request-send',
  templateUrl: './contact-request-send.component.html',
  styleUrls: ['./contact-request-send.component.scss', '../contact-style.scss']
})
export class ContactRequestSendComponent implements OnInit {

  public to: User;
  public from: User;
  public saving = false;

  constructor(private model: ModelService,
              private notify: NotificationsService,
              private route: ActivatedRoute,
              private router: Router,
              private auth: AuthService) { }

  async ngOnInit() {
    this.to = await this.model.readUser(this.route.snapshot.params['username']);
    this.from = await this.model.readUser(this.auth.username);
  }

  async sendRequest({ trust, reference, message }: any): Promise<void> {
    this.saving = true;
    await this.model.sendContactRequestTo(this.to.username, { trust, reference, message });
    this.saving = false;
    this.notify.info(`Contact request to ${this.to.username} was sent.`);
    await this.router.navigate([`/user/${this.from.username}/contacts`]);
  }
}
