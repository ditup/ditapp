import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { pick } from 'lodash';

import { ModelService } from '../../model.service';
import { Contact, User } from '../../shared/types';

class FormData {
  constructor(public trust: number, public reference: string) { }
}

@Component({
  selector: 'app-contact-update',
  templateUrl: './contact-update.component.html',
  styleUrls: ['./contact-update.component.scss']
})
export class ContactUpdateComponent implements OnInit {

  public from: User;
  public to: User;
  public message: string;
  public initialFormData: FormData;
  public formFields = ['trust', 'reference'];

  constructor(private route: ActivatedRoute,
              private model: ModelService,
              private router: Router) { }

  ngOnInit() {
    this.route.data
      .subscribe(async ({ contact: { fromMe } }: { contact: { fromMe: Contact } }) => {
        this.from = fromMe.from;
        this.to = fromMe.to;
        this.initialFormData = pick(fromMe, this.formFields) as FormData;
      });
  }

  public get updateContact() {
    return async function ({ trust, reference }: FormData): Promise<void> {
      await this.model.updateContactWith(this.to.username, { trust, reference });
      this.router.navigate([`/user/${this.to.username}`]);
    }.bind(this);
  }

}
