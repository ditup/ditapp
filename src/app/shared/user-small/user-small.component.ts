import { Component, OnInit, Input } from '@angular/core';

import { User } from '../types';

@Component({
  selector: 'app-user-small',
  templateUrl: './user-small.component.html',
  styleUrls: ['./user-small.component.scss']
})
export class UserSmallComponent implements OnInit {

  @Input()
  public user: User;

  constructor() { }

  ngOnInit() { }
}

/**
 * Stub component for testing
 */
@Component({ selector: 'app-user-small', template: '' })
export class UserSmallStubComponent {
  @Input() user;
}
