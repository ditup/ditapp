import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../../shared/types';
import { ModelService } from '../../model.service';
import { AuthService } from '../../auth.service';
import { NotificationsService } from '../../notifications/notifications.service';

@Component({
  selector: 'app-contact-delete-button',
  templateUrl: './contact-delete-button.component.html',
  styleUrls: ['./contact-delete-button.component.scss']
})
export class ContactDeleteButtonComponent implements OnInit {

  // tslint:disable-next-line:no-input-rename
  @Input('with') public otherUser: User;
  @Input() public buttonLabel = 'delete';
  public isActivated = false;

  constructor(private model: ModelService,
              private auth: AuthService,
              private notify: NotificationsService,
              private router: Router) { }

  ngOnInit() {
  }

  public async deleteContact() {
    await this.model.deleteContactWith(this.otherUser.id);

    this.notify.info(`Contact with ${this.otherUser.id} was deleted.`);

    await this.router.navigate([`/user/${this.auth.username}/contacts`]);
  }

  public activate(toBeActivated: boolean) {
    this.isActivated = toBeActivated;
  }

}
