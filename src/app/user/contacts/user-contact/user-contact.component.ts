import { Component, OnInit, Input } from '@angular/core';

import { User, Contact } from '../../../shared/types';

@Component({
  selector: 'app-user-contact',
  templateUrl: './user-contact.component.html',
  styleUrls: ['./user-contact.component.scss']
})
export class UserContactComponent implements OnInit {

  @Input()
  public me: User;

  @Input()
  public contact: Contact;

  public referenceVisibility = false;

  // TODO this should be dried
  public trustLevels = [
    {
      value: 1,
      label: 'some trust: not met in reality'
    },
    {
      value: 2,
      label: 'trust: acquaintance, friend, ...'
    },
    {
      value: 4,
      label: 'high trust: good friend, collaborator, ...'
    },
    {
      value: 8,
      label: 'full trust: close friend, family, long term collaborator, ...'
    }
  ];

  constructor() { }

  ngOnInit() {
  }

  get trustLevelDescription(): string {
    const level = this.trustLevels.find(lvl => lvl.value === this.contact.trust);
    return level.label;
  }

  public toggleReferenceVisibility() {
    this.referenceVisibility = !this.referenceVisibility;
  }

}
