export interface User {
  username: string,
  givenName?: string,
  familyName?: string,
  description?: string,
  location?: [number, number],
  preciseLocation?: [number, number],
  // TODO add later userTags?: UserTag[],
  email?: string
}
