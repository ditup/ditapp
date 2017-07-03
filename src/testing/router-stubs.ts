import { Injectable, Directive, Input, Component, HostListener } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// tslint:disable-next-line:directive-selector
@Directive({ selector: '[routerLink]' })
export class RouterLinkStubDirective {
  @Input() routerLink: any;
  navigatedTo: any = null;

  @HostListener('click') onClick() {
    this.navigatedTo = this.routerLink;
  }
}

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[routerLinkActive]',
  exportAs: 'routerLinkActive'
})
export class RouterLinkActiveStubDirective {
  @Input()
  routerLinkActiveOptions;
}

// tslint:disable-next-line:component-selector
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
    url; // tslint:disable-line:no-unused-expression
  }

}
