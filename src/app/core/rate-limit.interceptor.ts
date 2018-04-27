import { Injectable } from '@angular/core';
import { HttpEvent, HttpEventType, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/retry';
import { of } from 'rxjs/observable/of';
import { switchMap, concatMap } from 'rxjs/operators';


const request$ = new Subject<HttpRequest<any>>();

@Injectable()
export class RateLimitInterceptor implements HttpInterceptor {

  constructor() { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).retry(5);
  }

}
