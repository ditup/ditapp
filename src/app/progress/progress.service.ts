import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ProgressService {

  private progressSource = new Subject<{ id: number, progress: number }>();
  progressChanged$ = this.progressSource.asObservable();

  constructor() { }

  // create a new progress bar, returns id of the progress bar
  create(): number {
    const id = Math.random();
    this.progressSource.next({ id, progress: 0 });

    return id;
  }

  // change value of the progress bar
  update(id: number, progress: number) {
    this.progressSource.next({ id, progress });
  }

  // remove the progress bar
  remove(id) {
    this.progressSource.next({ id, progress: -1 });
  }

}
