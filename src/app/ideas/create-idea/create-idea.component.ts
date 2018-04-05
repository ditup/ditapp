import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Idea } from 'app/models/idea';
import { ModelService } from '../../model.service';
import { NotificationsService } from 'app/notifications/notifications.service';

@Component({
  selector: 'app-create-idea',
  templateUrl: './create-idea.component.html',
  styleUrls: ['./create-idea.component.scss']
})
export class CreateIdeaComponent implements OnInit {

  public idea: Idea = { id: '', title: '', detail: '', creatorId: '', tags: [] };

  constructor(private model: ModelService,
              private notify: NotificationsService,
              private router: Router) { }

  ngOnInit() {
  }

  /**
   * What should happen when the new idea is submitted
   * (received event from idea-form component)
   */
  async onSubmitIdea(idea: Idea) {
    // send request to server
    const newIdea: Idea = await this.model.createIdea(idea);

    // notify about success
    this.notify.info('Idea is created. Add some tags now!');

    // redirect to idea page
    await this.router.navigate(['idea', newIdea.id, 'edit-tags']);
  }

}
