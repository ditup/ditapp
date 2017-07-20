import { async, /*fakeAsync, tick, */ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectTagsComponent } from './select-tags.component';
import { SelectFromMyTagsComponent } from '../select-from-my-tags/select-from-my-tags.component';

import { Component, EventEmitter, Output } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { Tag, TagList } from '../types';

import { AuthService } from '../../auth.service';
import { ModelService } from '../../model.service';

class AuthStubService {
}

class ModelStubService {
}

@Component({ selector: 'app-tag-autocomplete', template: '' })
class TagAutocompleteStubComponent {
  @Output() action = new EventEmitter<Tag>();
}

describe('SelectTagsComponent', () => {
  let component: SelectTagsComponent;
  let fixture: ComponentFixture<SelectTagsComponent>;

  let emittedTags: Tag[];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SelectTagsComponent,
        TagAutocompleteStubComponent,
        SelectFromMyTagsComponent
      ],
      imports: [
        MaterialModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: AuthService, useClass: AuthStubService },
        { provide: ModelService, useClass: ModelStubService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    // subscribe to the Output('onSelected') of this component
    component.onSelected.subscribe((tags: Tag[]) => {
      emittedTags = tags;
    });


  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('[autocomplete tag not in list] should emit existent tags from autocomplete', () => {
    // let's have some tags at the beginning
    component.tagList = new TagList([
      { tagname: 'tag0' },
      { tagname: 'tag1' },
      { tagname: 'tag2' }
    ]);

    // get a handle of app-tag-autocomplete
    const autocompleteComponent = fixture.debugElement.query(By.css('app-tag-autocomplete')).componentInstance;


    fixture.detectChanges();

    // let's emit a found tag from app-tag-autocomplete
    autocompleteComponent.action.emit({ tagname: 'tag3' } as Tag);

    fixture.detectChanges();


    // the onSelected should have emitted 4 tags
    expect(emittedTags.length).toEqual(4);

    // we should have the current tag selection displayed
    const selectedTags = fixture.debugElement.queryAll(By.css('.tag-selected'));
    expect(selectedTags.length).toEqual(4);

  });

  it('[autocomplete tag in list already] should notify about error and not emit existent tags', () => {
    pending();
  });

  it('when clicking Clear button, selection should be removed and empty array emitted', () => {
    // let's have some tags at the beginning
    component.tagList = new TagList([
      { tagname: 'tag0' },
      { tagname: 'tag1' },
      { tagname: 'tag2' }
    ]);

    fixture.detectChanges();

    const originalTags = fixture.debugElement.queryAll(By.css('.tag-selected'));
    expect(originalTags.length).toEqual(3);

    const clearButton = fixture.debugElement.query(By.css('.clear-selection'));

    expect(clearButton).toBeTruthy();

    clearButton.triggerEventHandler('click', null);

    fixture.detectChanges();

    expect(emittedTags.length).toEqual(0);

    const selectedTags = fixture.debugElement.queryAll(By.css('.tag-selected'));
    expect(selectedTags.length).toEqual(0);
  });

  it('when clicking close button on a tag, the tag should be removed and smaller array emitted', () => {
    // initial tags
    component.tagList = new TagList([
      { tagname: 'tag0' },
      { tagname: 'tag1' },
      { tagname: 'tag2' }
    ]);

    fixture.detectChanges();

    const buttonClose = fixture.debugElement.query(By.css('.tag-selected-remove'));

    expect(buttonClose).toBeTruthy();

    buttonClose.triggerEventHandler('click', null);

    fixture.detectChanges();

    expect(emittedTags.length).toEqual(2);

    const selectedTags = fixture.debugElement.queryAll(By.css('.tag-selected'));
    expect(selectedTags.length).toEqual(2);
  });

  it('[click selectFromMyTags] open dialog with my tags', /* fakeAsync(() => {
    const button = fixture.debugElement.query(By.css('.open-select-dialog'));
    expect(button).toBeTruthy();
    button.triggerEventHandler('click', null);
    fixture.detectChanges();
    tick();


  })*/() => { pending(); });
});
