import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { User } from '../../shared/types';

@Component({
  selector: 'app-people-with-my-tags',
  templateUrl: './people-with-my-tags.component.html',
  styleUrls: ['./people-with-my-tags.component.scss']
})
export class PeopleWithMyTagsComponent implements OnInit {

  public users: User[];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(({ users }: { users: User[] }) => {
      this.users = users;
    });
  }

}
