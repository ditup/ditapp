import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { pick } from 'lodash';

import { ModelService } from '../../model.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { Contact, User } from '../../shared/types';

class FormData {
  constructor(public trust: number, public reference: string) { }
}

@Component({
  selector: 'app-contact-update',
  templateUrl: './contact-update.component.html',
  styleUrls: ['./contact-update.component.scss', '../contact-style.scss']
})
export class ContactUpdateComponent implements OnInit {

  public from: User;
  public to: User;
  public message: string;
  public initialFormData: FormData;
  public formFields = ['trust', 'reference'];
  public saving = false;

  constructor(private route: ActivatedRoute,
              private model: ModelService,
              private notify: NotificationsService,
              private router: Router) { }

  ngOnInit() {
    this.route.data
      .subscribe(async ({ contact: { fromMe } }: { contact: { fromMe: Contact } }) => {
        this.from = fromMe.from;
        this.to = fromMe.to;
        this.initialFormData = pick(fromMe, this.formFields) as FormData;
      });
  }

  public async updateContact({ trust, reference }: FormData): Promise<void> {
    this.saving = true;
    await this.model.updateContactWith(this.to.id, { trust, reference });
    this.notify.info(`Contact with ${this.to.id} was updated.`);
    await this.router.navigate([`/user/${this.from.id}/contacts`]);
    this.saving = false;
  }
}
