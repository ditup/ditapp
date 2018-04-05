import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { UserTag, Tag } from '../types';

class MyTag {
  constructor(public tag: Tag,
              public selected: boolean,
              public selectable: boolean) { }
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

  // tslint:disable-next-line:no-output-on-prefix
  @Output() public onSubmit = new EventEmitter<Tag[]>();

  public ref: MatDialogRef<SelectFromMyTagsComponent>;

  public myTags: MyTag[];

  constructor() { }

  public generateMyTags() {
    this.myTags = this.userTags.map((userTag: UserTag) => {

      const found = this.originalSelection.findIndex((selection) => {
        return userTag.tagId === selection.id;
      });

      const selectable: boolean = (found === -1) ? true : false;

      return {
        tag: { id: userTag.tagId },
        selected: false,
        selectable
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
    return this.myTags
      .filter(myTag => myTag.selected === getSelected && myTag.selectable === true)
      .map(myTag => myTag.tag);
  }

  public toggleSelection(tag: MyTag) {
    console.log('toggle', tag);
    if (tag.selectable) {
      tag.selected = !tag.selected;
    }
  }

}
