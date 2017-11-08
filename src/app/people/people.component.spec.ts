import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { map } from 'lodash';

import { PeopleComponent } from './people.component';
import { TabNavComponent } from '../shared/tab-nav/tab-nav.component';

describe('PeopleComponent', () => {
  let component: PeopleComponent;
  let fixture: ComponentFixture<PeopleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PeopleComponent,
        TabNavComponent
      ],
      imports: [
        RouterTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have title People', () => {
    const title = fixture.debugElement.query(By.css('h1'));
    expect(title).toBeTruthy();

    expect(title.nativeElement.innerHTML).toEqual('People');
  });

  it('should have links to self, users related to tags, new, TODO: random', () => {
    const nav = fixture.debugElement.query(By.css('app-tab-nav'));

    const tabs: any = nav.componentInstance.navRoutes;
    expect(tabs.length).toEqual(3);

    // test link urls
    const urls = map(tabs, (tab: any) => tab.link);
    expect(urls).toEqual(['/people', '/people/with-tags', '/people/new'/*, '/people/random'*/]);

    // test link labels
    const labels = map(tabs, (tab: any) => tab.title);
    expect(labels).toEqual([
      'with my tags',
      'with tags',
      'new'/*,
      'random'*/
    ]);
  });

  it('should have router-outlet for the subpages', () => {
    const routerOutlet = fixture.debugElement.query(By.css('router-outlet'));
    expect(routerOutlet).toBeTruthy();
  });
});
