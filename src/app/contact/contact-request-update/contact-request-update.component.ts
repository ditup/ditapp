import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import * as _ from 'lodash';

import { ModelService } from '../../model.service';
import { Contact, User } from '../../shared/types';

export class FormData {
  constructor(public message: string,
              public trust: number,
              public reference: string) { }
}

@Component({
  selector: 'app-contact-request-update',
  templateUrl: './contact-request-update.component.html',
  styleUrls: ['./contact-request-update.component.scss', '../contact-style.scss']
})
export class ContactRequestUpdateComponent implements OnInit {

  public from: User;
  public to: User;
  public contact: Contact;
  public initialFormData: FormData;
  public saving = false;

  constructor(private route: ActivatedRoute,
              private model: ModelService,
              private router: Router) { }

  ngOnInit() {
    this.route.data
      .subscribe(async ({ contact: { fromMe } }: { contact: { fromMe: Contact } }) => {
        this.to = fromMe.to;
        this.from = fromMe.from;
        this.contact = fromMe;
        this.initialFormData = _.pick(this.contact, ['message', 'trust', 'reference']) as FormData;
      });
  }

  public async updateContactRequest({ message, trust, reference }: FormData): Promise<void> {
    this.saving = true;
    await this.model.updateContactWith(this.to.username, { message, trust, reference });
    this.router.navigate([`/user/${this.to.username}`]);
    this.saving = false;
  }


}
