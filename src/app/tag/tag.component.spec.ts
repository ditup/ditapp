/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialModule } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

import { Observable } from 'rxjs/Observable';

import { TagComponent } from './tag.component';
import { FofComponent } from '../fof/fof.component';
import { Tag } from '../shared/types';
import { RouterOutletStubComponent, RouterLinkStubDirective, RouterLinkActiveStubDirective } from '../../testing/router-stubs';

const tag: Tag = {
  tagname: 'testing-tagname'
};

class ActivatedRouteStub {
  data = Observable.of({ tag });
}

describe('TagComponent', () => {
  let component: TagComponent;
  let fixture: ComponentFixture<TagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TagComponent,
        FofComponent,
        RouterOutletStubComponent,
        RouterLinkStubDirective,
        RouterLinkActiveStubDirective
      ],
      imports: [MaterialModule, BrowserAnimationsModule],
      providers: [
        { provide: ActivatedRoute, useClass: ActivatedRouteStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the tag\'s name', () => {
    const tagnameElement = fixture.debugElement.query(By.css('.tagname-title'));

    const foundTagname = tagnameElement.nativeElement.innerHTML;
    expect(foundTagname).toEqual(tag.tagname);
  });

  it('should show tabs with related tags, related users, ...', () => {
    const { tagname } = tag;
    const links = fixture.debugElement.queryAll(By.css('[md-tab-link]'));

    expect(links.length).toEqual(2);

    // test link urls
    const urls = links.map(link => {
      const dir = link.injector.get(RouterLinkStubDirective) as RouterLinkStubDirective;
      return dir.routerLink;
    });
    expect(urls).toEqual([`/tag/${tagname}`, `/tag/${tagname}/people`]);

    // test link labels
    const labels = links.map(link => link.nativeElement.innerHTML.trim());
    expect(labels).toEqual([
      'tags',
      'people'
    ]);
  });

  it('should have router-outlet for the subpages', () => {
    const routerOutlet = fixture.debugElement.query(By.css('router-outlet'));
    expect(routerOutlet).toBeTruthy();
  });
});
