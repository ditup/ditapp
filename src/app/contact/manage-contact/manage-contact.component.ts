import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { has } from 'lodash';

import { Contact } from '../../shared/types';

@Component({
  selector: 'app-manage-contact',
  templateUrl: './manage-contact.component.html',
  styleUrls: ['./manage-contact.component.scss']
})
export class ManageContactComponent implements OnInit {

  public contactStatus: string;
  public isSelf: boolean;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data
      .subscribe((data: { contact: { toMe: Contact } } | null) => {

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
      });
  }
}
