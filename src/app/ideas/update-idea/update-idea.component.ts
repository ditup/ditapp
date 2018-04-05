import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../auth.service';
import { ModelService } from '../../model.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { Tag } from 'app/models/tag';
import { Idea } from 'app/models/idea';

@Component({
  selector: 'app-update-idea',
  templateUrl: './update-idea.component.html',
  styleUrls: ['./update-idea.component.scss']
})
export class UpdateIdeaComponent implements OnInit {

  public canEdit: boolean;
  public idea: Idea;
  public ideaTags: Tag[];
  public editOnlyTags: boolean;
  public isFormDisabled = false;

  constructor(private auth: AuthService,
              private model: ModelService,
              private notify: NotificationsService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.route.data.subscribe(({ idea, ideaTags, editOnlyTags = false }: { idea: Idea, ideaTags: Tag[], editOnlyTags?: boolean }) => {
      this.idea = idea;
      this.ideaTags = ideaTags;
      this.canEdit = this.auth.username === this.idea.creatorId;
      this.editOnlyTags = editOnlyTags;
    });
  }

  async onSubmitIdea(submittedIdea: Idea) {
    // disable the form
    this.isFormDisabled = true;

    // update the idea
    submittedIdea.id = this.idea.id;
    await this.model.updateIdea(submittedIdea);

    // notify about success
    this.notify.info('Idea was successfully updated.');

    // redirect to idea page
    await this.router.navigate(['idea', this.idea.id]);

    // enable the form again
    this.isFormDisabled = false;
  }
}
