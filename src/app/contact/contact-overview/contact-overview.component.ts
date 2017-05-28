import { Input, Component, OnInit } from '@angular/core';

import { User } from '../../shared/types';

@Component({
  selector: 'app-contact-overview',
  templateUrl: './contact-overview.component.html',
  styleUrls: ['./contact-overview.component.scss']
})
export class ContactOverviewComponent implements OnInit {

  @Input() public from: User;
  @Input() public to: User;
  constructor() { }

  ngOnInit() {
  }

}
