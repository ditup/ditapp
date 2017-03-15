import * as _ from 'lodash';

export class User {
  constructor(public username: string,
              public givenName?: string,
              public familyName?: string,
              public description?: string,
              public userTags?: UserTag[]) {
  }
}

export class Tag {
  constructor(public tagname: string,
              public description?: string,
              public created?: Date|number) {

    // TODO fix the creator

  }
}

export class UserTag {
  constructor(public user: User,
              public tag: Tag,
              public story: string,
              public relevance: number) {}
}

export class TagList {
  public tags: Tag[] = [];

  public get tagnames(): string[] {
    return _.map(this.tags, tag => tag.tagname);
  }

  public add(tagname: string): boolean {
    // is the tag already added to the list?
    const tagIndex: number = _.findIndex(this.tags, (tag) => {
      return tag.tagname === tagname;
    });
    const isAdded: boolean = (tagIndex === -1) ? false : true;

    if (isAdded) return true;


    // add tag to the list
    const tag = new Tag(tagname);
    this.tags.push(tag);

    return false;
  }

  public remove(tagname: string): boolean {
    _.pullAllBy(this.tags, [{ tagname }], 'tagname');
    return true;
  }
}

export class UserList {
  constructor(public users: User[]) {}
}
