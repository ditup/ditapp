import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from '../../auth.service';
import { Comment, Idea, Tag } from '../../shared/types';

@Component({
  selector: 'app-read-idea',
  templateUrl: './read-idea.component.html',
  styleUrls: ['./read-idea.component.scss']
})
export class ReadIdeaComponent implements OnInit {

  public idea: Idea;
  public ideaTags: Tag[];
  public comments: Comment[];
  public canEdit = false;


  constructor(private auth: AuthService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(({ idea, ideaTags, comments }: { idea: Idea, ideaTags: Tag[], comments: Comment[] }) => {
      // initialize data
      this.idea = idea;
      this.ideaTags = ideaTags;
      this.comments = comments;
      // check whether user can edit the idea
      this.canEdit = this.auth.username === this.idea.creator.username;
    });
  }

}
