import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

import * as _ from 'lodash';

import { ModelService } from '../model.service';
import { MdSnackBar } from '@angular/material';

import { Tag } from '../shared/types';
/*


import { TagList, UserList, UserTag, Tag } from '../shared/types';
*/
@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit {

  public selectedTab = 0;

  private querySeparator = '--';

  private queryTags: Tag[];

  constructor(private model: ModelService,
              private route: ActivatedRoute,
              private router: Router,
              private snackBar: MdSnackBar) {}

  private parseTagnames(tagnamesString: string): Tag[] {
    if (!_.isString(tagnamesString)) {
      return undefined;
    }

    const tagnames: string[] = (tagnamesString) ? tagnamesString.split(this.querySeparator) : [];
    return _.map(tagnames, tagname => new Tag(tagname));
  }

  private async tagsExist(tags: Tag[]) {
    // find out
    const existPromises = _.map(tags, tag => this.model.tagExists(tag.tagname));
    // execute in parallel
    const exist = await Promise.all(existPromises);

    // separate existent and nonexistent tags
    const existentTags: Tag[] = [];
    const nonexistentTags: Tag[] = [];

    _.each(exist, (exists: boolean, i) => {
      if (exists) {
        existentTags.push(tags[i]);
      } else {
        nonexistentTags.push(tags[i]);
      }
    });

    return [existentTags, nonexistentTags];

  }

  async ngOnInit() {

    // get the urlParams
    const tagString: string = this.route.snapshot.queryParams['tags'];

    // if params.tags exists
    const tags: Tag[] = this.parseTagnames(tagString);

    if (_.isArray(tags)) {

      // move to the other tab
      this.changeTab(true);

      // check which tagnames exist
      const [existentTags, nonexistentTags]: Tag[][] = await this.tagsExist(tags);

      // update the tags
      this.queryTags = existentTags;

      // complain about unexistent tagnames
      if (nonexistentTags.length > 0) {
        // complain
        const [s, es] = (nonexistentTags.length > 1) ? ['s', ''] : ['', 'es'];

        const nonexistent: string = _.map(nonexistentTags, tag => tag.tagname).join(', ');
        this.snackBar.open(`The tag${s} ${nonexistent} do${es}n't exist`, 'OK');

        // update url with existent tagnames
        await this.changeUrl(true, existentTags, true);
      }
    }

    console.log('establishing params observer');
    // Observe query params and their changing
    this.route.queryParams.map(params => {
      console.log('observed url change', params);

      // 1. get the tagnames from query
      const tagnameString = params['tags'];

      return this.parseTagnames(tagnameString);

    }).subscribe(async (tgs: Tag[]) => {

      if (tgs === undefined) {
        this.changeTab(false);
        return;
      }

      this.changeTab(true);

      // 2. are the tags different from the current tag list?
      const difference: Tag[] = _.xor(this.queryTags, tgs);
      const isQueryDifferent: boolean = difference.length > 0;

      // 3. update the tag list and find users
      if (isQueryDifferent) {
        this.queryTags = tgs;
      }

    });

    console.log('finished oninit');

  }

  public async selectedTabChanged(tabno: number) {
    const withTags = (tabno === 1) ? true : false;
    await this.changeUrl(withTags, this.queryTags);
  }

  public get changeQuery() {
    return this.changeUrl.bind(this, true);
  }

  private async changeUrl(withTags: boolean, tags?: Tag[], replaceUrl?: boolean) {
    tags = tags || [];
    const navigationExtras: NavigationExtras = {
      relativeTo: this.route,
      replaceUrl
    };

    if (withTags) {
      const tagString = _.map(tags, tag => tag.tagname).join(this.querySeparator);
      navigationExtras.queryParams = { tags: tagString };
    }

    await this.router.navigate([], navigationExtras);
  }

  private changeTab(withTags: boolean) {
    this.selectedTab = (withTags) ? 1 : 0;
  }

}
