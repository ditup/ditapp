import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as fromRoot from 'app/reducers';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  logged$: Observable<boolean>;

  constructor(private store: Store<fromRoot.State>) {
    this.logged$ = this.store.pipe(select('auth', 'logged'));
  }

  ngOnInit() {
  }

}
