import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { map } from 'lodash';

import { TagsComponent } from './tags.component';
import { TabNavComponent } from '../shared/tab-nav/tab-nav.component';

describe('TagsComponent', () => {
  let component: TagsComponent;
  let fixture: ComponentFixture<TagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TagsComponent,
        TabNavComponent
      ],
      imports: [
        RouterTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should have title Tags', () => {
    const title = fixture.debugElement.query(By.css('h1'));
    expect(title).toBeTruthy();

    expect(title.nativeElement.innerHTML).toEqual('Tags');
  });

  it('should have links to self, tags related to tags, new, random', () => {
    const tabDebug = fixture.debugElement.query(By.css('app-tab-nav'));

    const tabs = tabDebug.componentInstance.navRoutes;

    expect(tabs.length).toEqual(4);

    // test link urls
    const urls = map(tabs, (tab: any) => tab.link);
    expect(urls).toEqual(['/tags', '/tags/related-to-tags', '/tags/new', '/tags/random']);

    // test link labels
    const labels = map(tabs, (tab: any) => tab.title);
    expect(labels).toEqual([
      'related to my tags',
      'related to tags',
      'new',
      'random'
    ]);
  });

  it('should have router-outlet for the subpages', () => {
    const routerOutlet = fixture.debugElement.query(By.css('router-outlet'));
    expect(routerOutlet).toBeTruthy();
  });
});
