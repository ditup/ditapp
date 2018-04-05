export interface User {
  id: string, // username
  givenName?: string,
  familyName?: string,
  description?: string,
  location?: [number, number] | null,
  preciseLocation?: [number, number] | null,
  avatar?: {
    [size: string]: string // base64 string
  },
  email?: string,
  userTags?: string[], // userTag ids
  contacts?: string[] // contact ids
}
