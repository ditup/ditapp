export class Tag {
  constructor(public tagname: string, public description: string, public ?created: Date|number, public ?creator: any) {

    // TODO fix the creator

  }
}
