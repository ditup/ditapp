import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';

import * as _ from 'lodash';

import { TagList, UserList, Tag } from '../shared/types';
import { ModelService } from '../model.service';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit {

  // TODO make tagList observable
  public tagList = new TagList();
  public userList = new UserList([]);

  private queryDelimiter = '|';

  // showing a progress bar when users loading is in progress
  public loadingUsers: boolean = false;

  constructor(private snackBar: MdSnackBar,
              private model: ModelService,
              private router: Router,
              private route: ActivatedRoute) { }

  private parseTagnames(tagnamesString: string): string[] {
    return (tagnamesString) ? tagnamesString.split(this.queryDelimiter) : [];
  }

  private async navigateToTags(tagnames: string[], replaceUrl?: boolean){
    replaceUrl = replaceUrl || false;
    let navigationExtras: any = (tagnames.length > 0)
      ? { queryParams: { tags: tagnames.join(this.queryDelimiter) } }
      : {};

    navigationExtras.relativeTo = this.route;
    navigationExtras.replaceUrl = replaceUrl;

    console.log('Navigating.', navigationExtras);
    console.log(await this.router.navigate([], navigationExtras));
    console.log('after navigation');
  }

  async ngOnInit() {

    console.log('initializing!', '*****************************');

    // See whether all the tagnames provided in url exist.
    // 1. get the parametes from query
    const tagnames: string[] = this.parseTagnames(this.route.snapshot.queryParams['tags']);
    // 2. find out which of the tagnames exist
    const existPromises = _.map(tagnames, tagname => this.model.tagExists(tagname));
    const exist = await Promise.all(existPromises);

    // 3. separate existent and nonexistent tags
    const existentTagnames: string[] = [];
    const nonexistentTagnames: string[] = [];

    _.each(exist, (exists: boolean, i) => {
      if (exists) {
        existentTagnames.push(tagnames[i]);
      } else {
        nonexistentTagnames.push(tagnames[i]);
      }
    });

    // 4. if some tags don't exist, remove them from query url and complain
    if (nonexistentTagnames.length > 0) {
      // change query parameters
      await this.navigateToTags(existentTagnames, true);

      // complain
      const s = (nonexistentTagnames.length > 1) ? 's' : '';
      const es = (nonexistentTagnames.length > 1) ? '' : 'es';
      const nonexistent: string = nonexistentTagnames.join(', ');
      this.snackBar.open(`The tag${s} ${nonexistent} do${es}n't exist`, 'OK');
    }
    // 5. finished

    // Observe query params and their changing
    this.route.queryParams.map(params => {

      // 1. get the tagnames from query
      const tagnamesString = params['tags'];

      return this.parseTagnames(tagnamesString);
    }).subscribe(async (tagnames: string[]) => {

      // 2. are the tags different from the current tag list?
      const difference: string[] = _.xor(this.tagList.tagnames, tagnames);
      const isQueryDifferent: boolean = difference.length > 0;

      // 3. update the tag list and find users
      if (isQueryDifferent) {
        this.tagList.tags = _.map(tagnames, (tagname: string) => new Tag(tagname));
        await this.findUsersByTagList();
      }

    });
  }

  private async addTagToList(tagname: string) {

    const isAdded = this.tagList.add(tagname);

    if (isAdded) {
      this.snackBar.open(`tag ${tagname} is already in the list`, 'OK');
      return;
    }

    await this.findUsersByTagList();
  }

  public async removeTagFromList(tagname: string) {
    this.tagList.remove(tagname);
    await this.findUsersByTagList();
  }

  private async findUsersByTagList() {
    this.loadingUsers = true;

    await this.navigateToTags(this.tagList.tagnames);

    console.log('searching for users with tags', this.tagList.tags);
    const users = await this.model.findUsersByTags(this.tagList.tagnames);

    this.userList = new UserList(users);
    this.loadingUsers = false;
  }

  private async complainNonexistentTag (tagname: string) {
    this.snackBar.open(`tag ${tagname} doesn't exist`, 'OK');
  }

  get tagAutocompleteAction() {
    return this.addTagToList.bind(this);
  }

  get tagAutocompleteAction404() {
    return this.complainNonexistentTag.bind(this);
  }

}
