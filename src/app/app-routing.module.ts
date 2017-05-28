import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SignupComponent } from './signup/signup.component';
import { LoginBasicComponent } from './login-basic/login-basic.component';
import { MainComponent } from './main/main.component';

import { TagComponent } from './tag/tag.component';

import { UserComponent } from './user/user.component';
import { MessagesWithUserComponent } from './messages-with-user/messages-with-user.component';
import { PeopleComponent } from './people/people.component';
import { MapComponent } from './map/map.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { MessagesComponent } from './messages/messages.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ResetPasswordUpdateComponent } from './reset-password-update/reset-password-update.component';
import { AccountComponent } from './account/account.component';
import { ContactsComponent } from './user/contacts/contacts.component';
import { ProfileComponent } from './user/profile/profile.component';
import { FofComponent } from './fof/fof.component';

// contacts
import { ContactRequestSendComponent } from './contact/contact-request-send/contact-request-send.component';
import { ContactRequestUpdateComponent } from './contact/contact-request-update/contact-request-update.component';
import { ContactRequestProcessComponent } from './contact/contact-request-process/contact-request-process.component';
import { ContactUpdateComponent } from './contact/contact-update/contact-update.component';

// importing guards and their dependencies
import { AuthGuard } from './auth-guard.service';
import { AuthMeGuard } from './auth-me-guard.service';
import { CanDeactivateGuard } from './can-deactivate-guard.service';
import { UserResolver } from './user/user-resolver.service';
import { ContactResolver } from './contact/contact-resolver.service';
import { AuthService } from './auth.service';
import { BasicAuthService } from './basic-auth.service';
import { ModelService } from './model.service';

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
    path: 'contact-add/:username',
    component: ContactRequestSendComponent,
    canActivate: [AuthGuard]
    // TODO add a resolver to find out whether the contact exists
  },
  {
    path: 'contact-request-respond/:username',
    component: ContactRequestProcessComponent,
    canActivate: [AuthGuard],
    resolve: {
      contact: ContactResolver
    }
  },
  {
    path: 'contact-request-update/:username',
    component: ContactRequestUpdateComponent,
    canActivate: [AuthGuard],
    resolve: {
      contact: ContactResolver
    }
  },
  {
    path: 'contact-update/:username',
    component: ContactUpdateComponent,
    canActivate: [AuthGuard],
    resolve: {
      contact: ContactResolver
    }
  },
  {
    path: 'user/:username',
    component: UserComponent,
    canActivate: [AuthGuard],
    resolve: {
      user: UserResolver
    },
    children: [
      {
        path: '',
        component: ProfileComponent
      },
      {
        path: 'contacts',
        component: ContactsComponent
      }
    ]
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
    path: 'tag/:tagname',
    component: TagComponent
  },
  {
    path: 'people',
    component: PeopleComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'messages',
    component: MessagesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'messages/:username',
    component: MessagesWithUserComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'map',
    component: MapComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent
  },
  {
    path: 'reset-password/:username/:code',
    component: ResetPasswordUpdateComponent
  },
  {
    path: 'account',
    component: AccountComponent,
    canActivate: [AuthGuard]
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
    UserResolver,
    ContactResolver,
    AuthService,
    BasicAuthService,
    ModelService
  ]
})
export class AppRoutingModule { }
