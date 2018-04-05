export interface Contact {
  id: string, // usernameA--usernameB
  from: string,
  to: string,
  trust: number,
  reference: string,
  isConfirmed: boolean,
  created: number,
  confirmed?: number
}
