import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { map } from 'lodash';

import { PeopleComponent } from './people.component';

import { MaterialModule } from '../material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('PeopleComponent', () => {
  let component: PeopleComponent;
  let fixture: ComponentFixture<PeopleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PeopleComponent,
      ],
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
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

  it('should have links to self, users related to tags, new, random', () => {
    const links = fixture.debugElement.queryAll(By.css('[mat-tab-link]'));

    expect(links.length).toEqual(4);

    // test link urls
    const urls = map(links, link => link.nativeElement.getAttribute('routerlink'));
    expect(urls).toEqual(['/people', '/people/with-tags', '/people/new', '/people/random']);

    // test link labels
    const labels = map(links, link => link.nativeElement.innerHTML.trim());
    expect(labels).toEqual([
      'with my tags',
      'with tags',
      'new',
      'random'
    ]);
  });

  it('should have router-outlet for the subpages', () => {
    const routerOutlet = fixture.debugElement.query(By.css('router-outlet'));
    expect(routerOutlet).toBeTruthy();
  });
});
