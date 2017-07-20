import { Component, OnInit } from '@angular/core';

import { ModelService } from '../../model.service';
import { User, Tag } from '../../shared/types';

@Component({
  selector: 'app-people-with-tags',
  templateUrl: './people-with-tags.component.html',
  styleUrls: ['./people-with-tags.component.scss']
})
export class PeopleWithTagsComponent implements OnInit {

  public users: User[] = [];

  constructor(private model: ModelService) { }

  ngOnInit() {
  }

  public async findRelatedUsers(tags: Tag[]) {
    this.users = await this.model.findUsersByTags(tags);
  }

}
