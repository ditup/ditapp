import { Injectable } from '@angular/core';


import { NewUser } from './new-user';

@Injectable()
export class ModelService {

  constructor() { }

  createUser(newUser: NewUser): Promise<void> {
    console.log('creating new user!', newUser);
    return Promise.resolve();

  }

  isUsernameAvailable(username: string): Promise<boolean> {
    return new Promise(resolve => {
      setTimeout(function () {
        resolve(username === 'user1' ? false : true);
      }, 1000);
    });
  }

}
