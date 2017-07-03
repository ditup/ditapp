import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ModelService } from '../../model.service';
import { Contact, User } from '../../shared/types';

@Component({
  selector: 'app-contact-request-process',
  templateUrl: './contact-request-process.component.html',
  styleUrls: ['./contact-request-process.component.scss', '../contact-style.scss']
})
export class ContactRequestProcessComponent implements OnInit {

  public from: User;
  public to: User;
  public message: string;
  public saving = false;

  constructor(private route: ActivatedRoute,
              private model: ModelService,
              private router: Router) { }

  ngOnInit() {
    this.route.data
      .subscribe(async ({ contact: { toMe } }: { contact: { toMe: Contact } }) => {
        this.to = toMe.to;
        this.from = toMe.from;

        this.message = toMe.message;
      });
  }

  async confirmContact({ trust, reference }: any): Promise<void> {
    this.saving = true;

    await this.model.confirmContactRequestFrom(this.from.username, { trust, reference });
    this.router.navigate([`/user/${this.from.username}`]);
    this.saving = false;
  }

}
