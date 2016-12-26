import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SignupComponent } from './signup/signup.component';
import { MainComponent } from './main/main.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { FofComponent } from './fof/fof.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'user/:username/verify-email',
    component: VerifyEmailComponent
  },
  {
    path: 'user/:username/verify-email/:code',
    component: VerifyEmailComponent
  },
  {
    path: '**',
    component: FofComponent
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
