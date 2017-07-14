import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MaterialModule } from '@angular/material';

import { map } from 'lodash';

import { TagsComponent } from './tags.component';

import { RouterLinkStubDirective, RouterLinkActiveStubDirective, RouterOutletStubComponent } from '../../testing/router-stubs';

describe('TagsComponent', () => {
  let component: TagsComponent;
  let fixture: ComponentFixture<TagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TagsComponent,
        RouterOutletStubComponent,
        RouterLinkStubDirective,
        RouterLinkActiveStubDirective
      ],
      imports: [
        MaterialModule
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
    const links = fixture.debugElement.queryAll(By.css('[md-tab-link]'));

    expect(links.length).toEqual(4);

    // test link urls
    const urls = map(links, link => link.nativeElement.getAttribute('routerlink'));
    expect(urls).toEqual(['/tags', '/tags/relatedToTags', '/tags/new', '/tags/random']);

    // test link labels
    const labels = map(links, link => link.nativeElement.innerHTML.trim());
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
