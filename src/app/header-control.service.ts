import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class HeaderControlService {

  private displayHeaderSource = new Subject<boolean>();

  displayChanged$ = this.displayHeaderSource.asObservable();

  display(value: boolean) {
    this.displayHeaderSource.next(value);
  }

}
