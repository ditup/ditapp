import { Component, OnInit } from '@angular/core';

import { ProgressService } from './progress.service';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit {

  // array of ongoing progresses
  progressBars: { id: number, progress: number }[] = [];

  constructor(private progressControl: ProgressService) { }

  ngOnInit() {
    // subscribe to progress changes
    this.progressControl.progressChanged$.subscribe(({ id, progress }) => {
      if (progress >= 0) {
        this.updateProgress(id, progress);
      } else {
        this.deleteProgress(id);
      }
    });
  }

  // is anything in progress?
  get showProgressBar(): boolean {
    return this.progressBars.length > 0;
  }

  // updates a progress bar with given id, or creates it
  private updateProgress(id: number, progress: number) {
    const bar = this.progressBars.find(this.findInArray(id));
    if (bar) {
      bar.progress = progress;
    } else {
      this.progressBars.push({ id, progress });
    }
  }

  // removes a progress bar with given id
  private deleteProgress(id: number) {
    const index = this.progressBars.findIndex(this.findInArray(id));
    this.progressBars.splice(index, 1);
  }

  // returns a function which will be provided to this.progressBars.<find|findIndex>
  private findInArray(idToFind: number) {
    return ({ id, progress: _progress }) => id === idToFind;
  }

}
