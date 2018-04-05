export interface Message {
  id: string,
  from: string, // username
  to: string, // username
  body: string,
  created: number,
  read: boolean, // read by me?
}
