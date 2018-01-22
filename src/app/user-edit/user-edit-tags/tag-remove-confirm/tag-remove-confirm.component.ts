import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { UserTag } from '../../../shared/types';

@Component({
  selector: 'app-tag-remove-confirm',
  templateUrl: './tag-remove-confirm.component.html',
  styleUrls: ['./tag-remove-confirm.component.scss']
})
export class TagRemoveConfirmComponent implements OnInit {

  @Input() userTag: UserTag;

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onConfirm = new EventEmitter<UserTag>();

  constructor() { }

  ngOnInit() {
  }

  confirm(remove: boolean) {
    if (remove) {
      this.onConfirm.emit(this.userTag);
    }
  }

}
