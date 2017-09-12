import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import * as _ from 'lodash';

import { UserTag, Tag } from '../types';

import { MdDialogRef } from '@angular/material';


class MyTag {
  constructor(public tag: Tag,
              public selected: boolean,
              public originalSelection: boolean) {}
}

@Component({
  selector: 'app-select-from-my-tags',
  templateUrl: './select-from-my-tags.component.html',
  styleUrls: ['./select-from-my-tags.component.scss']
})
export class SelectFromMyTagsComponent implements OnInit {

  @Input()
  public originalSelection: Tag[] = [];

  @Input()
  public userTags: UserTag[] = [];

  @Input()
  public loading = false;

  @Output()
  public onSubmit = new EventEmitter<Tag[]>();

  public ref: MdDialogRef<SelectFromMyTagsComponent>;

  public myTags: MyTag[];

  constructor() { }

  public generateMyTags() {
    this.myTags = _.map(this.userTags, (userTag: UserTag) => {
      const found = _.find(this.originalSelection, (selection) => {
        return userTag.tag.tagname === selection.tagname;
      });

      const originalSelection: boolean = (_.isObject(found)) ? true : false;

      return {
        tag: userTag.tag,
        selected: originalSelection,
        originalSelection
      };
    });
  }

  ngOnInit() {
  }

  public get selectedTags(): Tag[] {
    return this.getSelection(true);
  }

  public close(selectedTags: Tag[]) {
    this.onSubmit.emit(selectedTags);
    this.ref.close();
  }

  public get unselectedTags(): Tag[] {
    return this.getSelection(false);
  }

  private getSelection(getSelected: boolean) {
    return _.map(
      _.filter(this.myTags, myTag => {
        return myTag.selected === getSelected && myTag.originalSelection === false;
      }), myTag => myTag.tag);
  }

  public toggleSelection(tag: MyTag) {
    console.log('toggle', tag);
    tag.selected = !tag.selected;
  }

}
