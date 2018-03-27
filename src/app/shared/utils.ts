import { HttpHeaders } from '@angular/common/http'

export const notLoggedHeaders = new HttpHeaders()
  .set('Content-Type', 'application/vnd.api+json')
  .set('Accept', 'application/vnd.api+json')
