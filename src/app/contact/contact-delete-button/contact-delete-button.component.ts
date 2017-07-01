import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../../shared/types';
import { ModelService } from '../../model.service';

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
              private router: Router) { }

  ngOnInit() {
  }

  public async deleteContact() {
    await this.model.deleteContactWith(this.otherUser.username);

    this.router.navigate([`/user/${this.otherUser.username}`]);
  }

  public activate(toBeActivated: boolean) {
    this.isActivated = toBeActivated;
  }

}
