import { Component, OnInit, Input } from '@angular/core';

import { User } from '../types';
import { ModelService } from '../../model.service';

@Component({
  selector: 'app-user-small',
  templateUrl: './user-small.component.html',
  styleUrls: ['./user-small.component.scss']
})
export class UserSmallComponent implements OnInit {

  public avatar: { base64: string, format: string };

  public avatarLoaded: boolean = false;

  @Input()
  public user: User;

  constructor(private model: ModelService) { }

  async ngOnInit() {
    this.avatar = await this.model.readAvatar(this.user.username);
    this.avatarLoaded = true;
  }

}
