/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MaterialModule } from '../material.module';
import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';

import { Observable } from 'rxjs/Observable';

import { TagComponent } from './tag.component';
import { FofComponent } from '../fof/fof.component';
import { TabNavComponent } from '../shared/tab-nav/tab-nav.component';
import { Tag } from '../shared/types';

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
        TabNavComponent
      ],
      imports: [
        MaterialModule,
        RouterTestingModule
      ],
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
    const tabsDebugElement = fixture.debugElement.query(By.css('app-tab-nav'));
    const tabs = tabsDebugElement.componentInstance.navRoutes;

    expect(tabs.length).toEqual(2);

    // test link urls
    const urls = tabs.map((tab: any) => tab.link);
    expect(urls).toEqual([`/tag/${tagname}`, `/tag/${tagname}/people`]);

    // test link labels
    const labels = tabs.map((tab: any) => tab.title);
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
