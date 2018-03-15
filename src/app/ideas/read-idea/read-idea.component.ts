import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from 'app/auth.service';
import { ModelService } from 'app/model.service';
import { Comment, Idea, Tag } from 'app/shared/types';

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
              private model: ModelService,
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

  async onVote(vote: number) {
    // when vote doesn't exist, we add it
    // when vote exists, we remove it
    // and we update the idea.votes object
    if (this.idea.votes.me === 0) {
      // we add the vote
      await this.model.vote({ to: { type: 'ideas', id: this.idea.id }, value: vote });

      if (vote === 1) { this.idea.votes.up += 1; }
      if (vote === -1) { this.idea.votes.down += 1; }
      this.idea.votes.me = vote;
    } else {
      // we remove the vote
      await this.model.vote({ to: { type: 'ideas', id: this.idea.id }, value: 0 });
      if (this.idea.votes.me === 1) { this.idea.votes.up -= 1; }
      if (this.idea.votes.me === -1) { this.idea.votes.down -= 1; }
      this.idea.votes.me = 0;
    }
  }
}
