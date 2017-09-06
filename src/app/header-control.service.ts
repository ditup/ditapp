import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class HeaderControlService {

  private displayHeaderSource = new Subject<boolean>();
  displayChanged$ = this.displayHeaderSource.asObservable();

  private updateAvatarSource = new Subject<void>();
  updateAvatar$ = this.updateAvatarSource.asObservable();

  display(value: boolean) {
    this.displayHeaderSource.next(value);
  }

  // inform header that avatar should be reloaded
  // i.e. when a new avatar was successfuly submitted
  updateAvatar() {
    this.updateAvatarSource.next();
  }

}
