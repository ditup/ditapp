import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MaterialModule } from '@angular/material';
import { Observable } from 'rxjs/Observable';

import { TagsRandomComponent } from './tags-random.component';

import { Tag } from '../../shared/types';
import { ModelService } from '../../model.service';

@Component({ selector: 'app-tag-list', template: '' })
class TagListStubComponent {
  @Input() tags = [];
}

class ActivatedRouteStub {
  public data = Observable.of({
    tags: [
      { tagname: 'tag0' }
    ]
  });
}

class ModelStubService {
  public async findRandomTags(): Promise<Tag[]> {
    return [{ tagname: 'tag3' }] as Tag[];
  }
}

describe('TagsRandomComponent', () => {
  let component: TagsRandomComponent;
  let fixture: ComponentFixture<TagsRandomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TagsRandomComponent,
        TagListStubComponent
      ],
      imports: [
        MaterialModule
      ],
      providers: [
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: ModelService, useClass: ModelStubService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsRandomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should display a list of random tags at the beginning', () => {
    const tagList = fixture.debugElement.query(By.css('app-tag-list'));
    expect(tagList).toBeTruthy();
    expect(tagList.componentInstance.tags.length).toEqual(1);
    expect(tagList.componentInstance.tags[0].tagname).toEqual('tag0');
  });

  it('should display another random tags when hitting refresh button', fakeAsync(() => {
    const refreshButton = fixture.debugElement.query(By.css('.refresh-button'));
    expect(refreshButton).toBeTruthy();

    // click refresh
    refreshButton.triggerEventHandler('click', null);

    fixture.detectChanges();

    tick();

    fixture.detectChanges();

    // the new tag should be loaded
    const newTagList = fixture.debugElement.query(By.css('app-tag-list'));
    expect(newTagList.componentInstance.tags.length).toEqual(1);
    expect(newTagList.componentInstance.tags[0].tagname).toEqual('tag3');
  }));
});
