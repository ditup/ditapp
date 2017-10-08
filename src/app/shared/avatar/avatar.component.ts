import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { ModelService } from '../../model.service';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnChanges {

  @Input() username: string;
  @Input() size = 128;

  public avatarUrl: string|SafeUrl; // { base64: string, format: string };

  constructor(private model: ModelService, private sanitizer: DomSanitizer) { }

  async ngOnChanges(changes: SimpleChanges) {
    // (re)load avatar when username changes
    if (changes.username && changes.username.previousValue !== changes.username.currentValue) {
      await this.loadAvatar();
    }
  }

  private async loadAvatar() {
    delete this.avatarUrl;
    const avatarUrl = await this.model.readAvatar(this.username, this.size);
    this.avatarUrl = this.sanitizer.bypassSecurityTrustUrl(avatarUrl);
  }
}
