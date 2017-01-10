import { Injectable } from '@angular/core';

@Injectable()
export class BasicAuthService {

  constructor() { }

  // log in
  login({ username, password, email }: { username: string, password: string, email: string|null}) {
    // save the basic auth credentials to localStorage
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);
    localStorage.setItem('email', (typeof email === 'string') ? email : '');
  }

  // log out
  logout() {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    localStorage.removeItem('email');
  }

  get logged(): boolean {
    return (typeof this.email === 'string' && this.email.length > 0);
  }

  get loggedUnverified(): boolean {
    return typeof this.username === 'string' && this.username.length > 0 && !this.logged;
  }

  get username(): string|undefined {
    return localStorage.getItem('username');
  }

  get email(): string|undefined {
    return localStorage.getItem('email');
  }
}
