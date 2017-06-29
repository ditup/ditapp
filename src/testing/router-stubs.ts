import { Injectable, Directive, Input, Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { User } from '../app/shared/types';

@Directive({
  selector: '[routerLink]',
  host: {
    '(click)': 'onClick()'
  }
})
export class RouterLinkStubDirective {
  @Input('routerLink') linkParams: any;
  navigatedTo: any = null;

  onClick() {
    this.navigatedTo = this.linkParams;
  }
}

@Directive({
  selector: '[routerLinkActive]',
  exportAs: 'routerLinkActive'
})
export class RouterLinkActiveStubDirective {
  @Input()
  routerLinkActiveOptions;
}

@Component({ selector: 'router-outlet', template: '' })
export class RouterOutletStubComponent { }

@Injectable()
export class ActivatedRouteStub {

  // ActivatedRoute.params is Observable
  private subject = new BehaviorSubject(this.testParams);
  params = this.subject.asObservable();

  // Test parameters
  private _testParams: {};
  get testParams() { return this._testParams; }
  set testParams(params: {}) {
    this._testParams = params;
    this.subject.next(params);
  }

  // ActivatedRoute.snapshot.params
  get snapshot() {
    return { params: this.testParams };
  }
}

@Injectable()
export class RouterStub {
  public navigate(url: any[]) {

  }

}
