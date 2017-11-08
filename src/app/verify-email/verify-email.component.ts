import { Component, OnInit, OnDestroy } from '@angular/core';
import { HeaderControlService } from '../header-control.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit, OnDestroy {

  constructor(private headerControl: HeaderControlService) { }

  ngOnInit() {
    // hide the header
    this.headerControl.display(false);
  }

  ngOnDestroy(): void {
    // show the header
    this.headerControl.display(true);
  }
}
