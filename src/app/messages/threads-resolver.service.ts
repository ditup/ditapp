import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ModelService } from '../model.service';
import { Message } from '../shared/types';

@Injectable()
export class ThreadsResolver implements Resolve<Message[]> {

  constructor(private model: ModelService) { }

  async resolve(): Promise<Message[]> {
    return await this.model.readThreads();
  }
}
