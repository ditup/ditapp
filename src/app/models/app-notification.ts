export interface AppNotification {
  id: string,
  type: 'info' | 'error',
  message: string,
  created: number,
}
