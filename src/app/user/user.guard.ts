import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { tap, filter, take, switchMap, catchError } from 'rxjs/operators';
import * as fromRoot from 'app/reducers';
import { Store, select } from '@ngrx/store';
import { User } from 'app/models/user';
import * as routerActions from 'app/actions/router';

@Injectable()
export class LoadUserGuard implements CanActivate {
  constructor(private store: Store<fromRoot.State>) {}

  getFromStoreOrAPI(): Observable<any> {
    return this.store.pipe(
      select(fromRoot.getRouteUser),
      tap((user: User) => {
        console.log('user found', user);
        if (!user) {
          console.log('requesting user');
          this.store.dispatch(new routerActions.GetRouterUser());
        }
      }),
      filter(user => !!user),
      take(1)
    );
  }
  canActivate(): Observable<boolean> {
    return this.getFromStoreOrAPI()
      .pipe(
        switchMap(() => of(true)),
        catchError(() => of(false))
      )
  }
}

@Injectable()
export class LoadContactsGuard implements CanActivate {
  constructor(private store: Store<fromRoot.State>) {}

  getFromStoreOrAPI(): Observable<any> {
    return this.store.pipe(
      select(fromRoot.getRouteUser),
      tap((user: User) => {
        console.log('user found', user);
        if (!user) {
          console.log('requesting user');
          this.store.dispatch(new routerActions.GetRouterUser());
        }
      }),
      filter(user => !!user),
      take(1)
    );
  }
  canActivate(): Observable<boolean> {
    return this.getFromStoreOrAPI()
      .pipe(
        switchMap(() => of(true)),
        catchError(() => of(false))
      )
  }
}
