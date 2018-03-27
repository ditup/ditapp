import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { User } from 'app/models/user';
import * as fromRoot from 'app/reducers';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

  public user$: Observable<User>;

  constructor(private store: Store<fromRoot.State>) {
    this.user$ = this.store.pipe(select('auth', 'user'));
  }

  ngOnInit() {
  }
}
