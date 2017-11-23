import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class FooterControlService {

  private displayFooterSource = new Subject<boolean>();
  displayChanged$ = this.displayFooterSource.asObservable();

  display(value: boolean) {
    this.displayFooterSource.next(value);
  }
}
