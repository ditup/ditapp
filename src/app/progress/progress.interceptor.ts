import { Injectable } from '@angular/core';
import { HttpEvent, HttpEventType, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { ProgressService } from './progress.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/finally';

@Injectable()
export class HttpProgressInterceptor implements HttpInterceptor {

  constructor(private progress: ProgressService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // TODO reporting progress?
    /*
    const newReqOptions = {
      body: req.body,
      headers: req.headers,
      reportProgress: true,
      responseType: req.responseType
    };
    const newReq = new HttpRequest(req.method, req.urlWithParams, newReqOptions);
    console.log(req, newReq, '**********');
    */

    let id: number;

    return next.handle(req).map(event => {

      switch (event.type) {
        case (HttpEventType.Sent): {
          id = this.progress.create();
          // this.progress.update(id, 10);
          break;
        }
        case (HttpEventType.Response): {
          return event;
        }
        // TODO needed when reporting progress
        /*
        case (HttpEventType.UploadProgress): {
          const loaded = (event.total === 0) ? 1 : event.loaded / event.total;
          this.progress.update(id, 10 + loaded * 30);
          break;
        }
        case (HttpEventType.DownloadProgress): {
          const loaded = (event.total === 0) ? 1 : event.loaded / event.total;
          this.progress.update(id, 50 + loaded * 49);
          break;
        }
        case (HttpEventType.ResponseHeader): {
          this.progress.update(id, 50);
          break;
        }

        default: {
          console.log(event.type, event);
        }
        */
      }
    })
      .finally(() => {
        this.progress.remove(id);
      });
  }
}
