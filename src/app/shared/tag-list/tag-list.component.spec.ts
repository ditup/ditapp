import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagListComponent } from './tag-list.component';

import { By } from '@angular/platform-browser';
import { MaterialModule } from '../../material.module';
import { Tag } from '../types';
import { RouterLinkStubDirective } from '../../../testing/router-stubs';

describe('TagListComponent', () => {
  let component: TagListComponent;
  let fixture: ComponentFixture<TagListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TagListComponent,
        RouterLinkStubDirective
      ],
      imports: [MaterialModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should display a list of tags', () => {
    const tagList: Tag[] = [ { tagname: 'tag1' }, { tagname: 'tag2' } ];
    component.tags = tagList;

    fixture.detectChanges();

    const tags = fixture.debugElement.queryAll(By.css('li'));
    expect(tags.length).toEqual(2);
  });

  it('tag should contain a link to its page', () => {
    const tagList: Tag[] = [ { tagname: 'tag1' } ];
    component.tags = tagList;

    fixture.detectChanges();

    const tag = fixture.debugElement.query(By.css('li'));
    const link = tag.nativeElement.getAttribute('ng-reflect-router-link');
    expect(link).toEqual('/tag/tag1');
  });
});
