import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  template: '',
  styleUrls: []
})
export class AvatarStubComponent {
  @Input() username;
  @Input() size;
  constructor() { }
}
