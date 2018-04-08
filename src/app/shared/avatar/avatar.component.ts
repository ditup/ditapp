import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { User } from 'app/models/user';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent {

  @Input() user: User;
  @Input() size = 128;

  constructor(private sanitizer: DomSanitizer) { }

  get avatarUrl(): string | SafeUrl {
    if (this.user && this.user.avatar) {
      return this.sanitizer.bypassSecurityTrustUrl(this.user.avatar[this.size]);
    }

    return '';
  }
}
