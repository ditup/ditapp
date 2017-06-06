import { Component, OnInit, OnChanges, Input } from '@angular/core';

import { ModelService } from '../../model.service';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit, OnChanges {

  @Input()
  username: string;

  public avatar: { base64: string, format: string };

  constructor(private model: ModelService) { }

  ngOnInit() {}

  async ngOnChanges() {
    // get avatar and assign it to this.avatar
    this.avatar = await this.model.readAvatar(this.username);
  }

}
