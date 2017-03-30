import * as _ from 'lodash';

export class User {
  constructor(public username: string,
              public givenName?: string,
              public familyName?: string,
              public description?: string,
              public location?: [number, number],
              public userTags?: UserTag[]) {
  }
}

export class Tag {
  constructor(public tagname: string,
              public created?: number) {

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

  public add(tagname: string) {
    // is the tag already added to the list?
    const tagIndex: number = _.findIndex(this.tags, (tag) => {
      return tag.tagname === tagname;
    });

    const isAdded: boolean = (tagIndex === -1) ? false : true;

    if (isAdded) throw new Error(`The tag ${tagname} is already in the list.`);

    // add tag to the list
    const tag = new Tag(tagname);
    this.tags.push(tag);

  }

  public get isEmpty(): boolean {
    return this.tags.length === 0;
  }

  public remove(tagname: string) {
    _.pullAllBy(this.tags, [{ tagname }], 'tagname');
  }
}

export class UserList {
  constructor(public users: User[]) {}
}

export class Message {
  constructor(public from: User,
              public to: User,
              public id: string,
              public body: string,
              public created: number) {}
}
