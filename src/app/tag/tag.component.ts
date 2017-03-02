import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Tag } from '../shared/tag';
import { ModelService } from '../model.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit {

  public tag: Tag = { tagname: '', description: '' };
  public tagLoading: boolean;
  public tagExists: boolean;

  constructor(private model: ModelService,
              private route: ActivatedRoute,
              private auth: AuthService) { }

  ngOnInit() {

    // observe the tagname parameter
    this.route.params.subscribe(async (params: Params) => {

      try {
        // load the tag from database
        this.tagLoading = true;
        const tagname: string = params['tagname'];
        this.tag = await this.model.readTag(tagname);

        this.tagLoading = false;
        this.tagExists = true;
      } catch (e) {
        this.tagLoading = false;

        console.log(e);
        if (e.status === 404) {
          this.tagExists = false;
        } else {
          throw e;
        }
      }
    });
  }

  public get canEditTag(): boolean {
    // TODO make it more protected
    return this.auth.logged;
  };
}
