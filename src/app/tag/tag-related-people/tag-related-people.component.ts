import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../shared/types';

@Component({
  selector: 'app-tag-related-people',
  templateUrl: './tag-related-people.component.html',
  styleUrls: ['./tag-related-people.component.scss']
})
export class TagRelatedPeopleComponent implements OnInit {

  public users: User[];

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(({ users }: { users: User[] }) => {
      users.forEach(user => {
        delete user.userTags;
      });

      this.users = users;
    });
  }

}
