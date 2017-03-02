import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SignupComponent } from './signup/signup.component';
import { LoginBasicComponent } from './login-basic/login-basic.component';
import { MainComponent } from './main/main.component';

import { TagsNewComponent } from './tags-new/tags-new.component';
import { TagComponent } from './tag/tag.component';
import { TagEditComponent } from './tag-edit/tag-edit.component';

import { UserComponent } from './user/user.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { FofComponent } from './fof/fof.component';

// importing guards and their dependencies
import { AuthGuard } from './auth-guard.service';
import { AuthMeGuard } from './auth-me-guard.service';
import { CanDeactivateGuard } from './can-deactivate-guard.service';
import { AuthService } from './auth.service';
import { BasicAuthService } from './basic-auth.service';

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
    path: 'login',
    component: LoginBasicComponent
  },
  {
    path: 'user/:username',
    component: UserComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'user/:username/edit',
    component: UserEditComponent,
    canActivate: [AuthGuard, AuthMeGuard],
    canDeactivate: [CanDeactivateGuard]
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
    path: 'tags/new',
    component: TagsNewComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'tag/:tagname',
    component: TagComponent
  },
  {
    path: 'tag/:tagname/edit',
    component: TagEditComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: '**',
    component: FofComponent
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  providers: [
    AuthGuard,
    AuthMeGuard,
    CanDeactivateGuard,
    AuthService,
    BasicAuthService
  ]
})
export class AppRoutingModule { }
