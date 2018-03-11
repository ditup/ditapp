import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BaseComponent } from './base/base.component';

import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';

import { UserComponent } from './user/user.component';
import { MessagesWithUserComponent } from './messages-with-user/messages-with-user.component';
import { MapComponent } from './map/map.component';

// user edit
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserEditProfileComponent } from './user-edit/user-edit-profile/user-edit-profile.component';
import { UserEditTagsComponent } from './user-edit/user-edit-tags/user-edit-tags.component';
import { UserEditLocationComponent } from './user-edit/user-edit-location/user-edit-location.component';

import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { VerifyEmailCodeComponent } from './verify-email-code/verify-email-code.component';
import { MessagesComponent } from './messages/messages.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ResetPasswordUpdateComponent } from './reset-password-update/reset-password-update.component';
import { AccountComponent } from './account/account.component';
import { ContactsComponent } from './user/contacts/contacts.component';
import { ProfileComponent } from './user/profile/profile.component';

// tag
import { TagComponent } from './tag/tag.component';
import { TagRelatedTagsComponent } from './tag/tag-related-tags/tag-related-tags.component';
import { TagRelatedPeopleComponent } from './tag/tag-related-people/tag-related-people.component';
import { TagRelatedIdeasComponent } from './tag/tag-related-ideas/tag-related-ideas.component';

// people
import { PeopleComponent } from './people/people.component';
import { PeopleWithMyTagsComponent } from './people/people-with-my-tags/people-with-my-tags.component';
import { PeopleWithTagsComponent } from './people/people-with-tags/people-with-tags.component';
import { PeopleNewComponent } from './people/people-new/people-new.component';
import { PeopleRandomComponent } from './people/people-random/people-random.component';

// ideas
import { CreateIdeaComponent } from './ideas/create-idea/create-idea.component';
import { ReadIdeaComponent } from './ideas/read-idea/read-idea.component';
import { UpdateIdeaComponent } from './ideas/update-idea/update-idea.component';
import { IdeasComponent } from './ideas/ideas/ideas.component';
import { IdeasWithMyTagsComponent } from './ideas/ideas-with-my-tags/ideas-with-my-tags.component';
import { NewIdeasComponent } from './ideas/new-ideas/new-ideas.component';
import {
  IdeaResolver, IdeaCommentsResolver, IdeaTagsResolver, IdeasWithMyTagsResolver, NewIdeasResolver, IdeasWithTagResolver
} from './ideas/ideas-resolver.service';

// tags
import { TagsComponent } from './tags/tags.component';
import { TagsRelatedToMyTagsComponent } from './tags/tags-related-to-my-tags/tags-related-to-my-tags.component';
import { TagsRelatedToTagsComponent } from './tags/tags-related-to-tags/tags-related-to-tags.component';
import { TagsNewComponent } from './tags/tags-new/tags-new.component';
import { TagsRandomComponent } from './tags/tags-random/tags-random.component';

// 404
import { FofComponent } from './fof/fof.component';

// contacts
import { ManageContactComponent } from './contact/manage-contact/manage-contact.component';

// importing guards and their dependencies
import { AuthGuard } from './auth-guard.service';
import { CanDeactivateGuard } from './can-deactivate-guard.service';
import { AuthExpGuard } from './base/auth-exp-guard.service';

// resolvers
import { UserResolver, LoggedUserResolver } from './user/user-resolver.service';
import { LoggedUserTagsResolver } from './user/user-tags-resolver.service';
import { TagResolver } from './tag/tag-resolver.service';
import { ContactResolver } from './contact/contact-resolver.service';
import { ThreadsResolver } from './messages/threads-resolver.service';
import { MessagesResolver } from './messages-with-user/messages-resolver.service';
import { TagsRelatedToMyTagsResolver, RandomTagsResolver, TagsRelatedToTagResolver } from './tags/tags-resolver.service';
import { PeopleWithMyTagsResolver, NewPeopleResolver, PeopleWithTagResolver } from './people/people-resolver.service';

// services
import { AuthService } from './auth.service';
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
    component: LoginComponent
  },
  {
    path: 'contact-with/:username',
    component: ManageContactComponent,
    canActivate: [AuthGuard],
    resolve: {
      contact: ContactResolver,
      user: UserResolver
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
    path: 'profile/edit',
    component: UserEditComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard],
    resolve: {
      user: LoggedUserResolver
    },
    children: [
      {
        path: '',
        component: UserEditProfileComponent
      },
      {
        path: 'tags',
        component: UserEditTagsComponent,
        resolve: {
          userTags: LoggedUserTagsResolver
        }
      },
      {
        path: 'location',
        component: UserEditLocationComponent
      }
    ]
  },
  {
    path: 'verify-email',
    component: VerifyEmailComponent
  },
  {
    path: 'verify-email/:username/:code',
    component: VerifyEmailCodeComponent
  },
  {
    path: 'tag/:tagname',
    component: TagComponent,
    resolve: {
      tag: TagResolver
    },
    children: [
      {
        path: '',
        component: TagRelatedPeopleComponent,
        resolve: {
          users: PeopleWithTagResolver
        }
      },
      {
        path: 'tags',
        component: TagRelatedTagsComponent,
        resolve: {
          tags: TagsRelatedToTagResolver
        }
      },
      {
        path: 'ideas',
        component: TagRelatedIdeasComponent,
        resolve: {
          ideas: IdeasWithTagResolver
        }
      }
    ]
  },
  {
    path: 'tags',
    component: TagsComponent,
    children: [
      {
        path: '',
        component: TagsRelatedToMyTagsComponent,
        resolve: {
          tags: TagsRelatedToMyTagsResolver
        }
      },
      {
        path: 'related-to-tags',
        component: TagsRelatedToTagsComponent
      },
      {
        path: 'new',
        component: TagsNewComponent,
        /*
        resolve: {
          tags: TagsNewResolver
        }
        */
      },
      {
        path: 'random',
        component: TagsRandomComponent,
        resolve: {
          tags: RandomTagsResolver
        }
      },
    ]
  },
  {
    path: 'people',
    canActivate: [AuthGuard],
    component: PeopleComponent,
    children: [
      {
        path: '',
        component: PeopleWithMyTagsComponent,
        resolve: {
          users: PeopleWithMyTagsResolver
        }
      },
      {
        path: 'with-tags',
        component: PeopleWithTagsComponent
      },
      {
        path: 'new',
        component: PeopleNewComponent,
        resolve: {
          users: NewPeopleResolver
        }
      },
      {
        path: 'random',
        component: PeopleRandomComponent,
        /*
        resolve: {
          tags: RandomPeopleResolver
        }
        */
      },
    ]
  },
  {
    path: 'ideas',
    component: IdeasComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: IdeasWithMyTagsComponent,
        resolve: {
          ideas: IdeasWithMyTagsResolver
        }
      },
      {
        path: 'new',
        component: NewIdeasComponent,
        resolve: {
          ideas: NewIdeasResolver
        }
      }
    ]
  },
  {
    path: 'ideas/create',
    component: CreateIdeaComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'idea/:id/edit',
    component: UpdateIdeaComponent,
    canActivate: [AuthGuard],
    resolve: {
      idea: IdeaResolver,
      ideaTags: IdeaTagsResolver
    }
  },
  {
    path: 'idea/:id/edit-tags',
    component: UpdateIdeaComponent,
    data: {
      editOnlyTags: true
    },
    canActivate: [AuthGuard],
    resolve: {
      idea: IdeaResolver,
      ideaTags: IdeaTagsResolver
    }
  },
  {
    path: 'idea/:id',
    component: ReadIdeaComponent,
    // @TODO maybe not auth guard. maybe ideas should be visible to visitors, too
    canActivate: [AuthGuard],
    resolve: {
      idea: IdeaResolver,
      ideaTags: IdeaTagsResolver,
      comments: IdeaCommentsResolver
    }
  },
  {
    path: 'messages',
    component: MessagesComponent,
    canActivate: [AuthGuard],
    resolve: {
      threads: ThreadsResolver
    },
  },
  {
    path: 'messages/:username',
    component: MessagesWithUserComponent,
    canActivate: [AuthGuard],
    resolve: {
      messages: MessagesResolver,
      otherUser: UserResolver
    },

  },
  {
    path: 'map',
    component: MapComponent,
    resolve: {
      user: LoggedUserResolver
    },
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
    canActivate: [AuthGuard],
    resolve: {
      user: LoggedUserResolver
    }
  },
  {
    path: '**',
    component: FofComponent
  }
];

/**
 * The routeWrapper is present to be able to resolve time till authentication expiration for every path.
 */
const routeWrapper: Routes = [
  {
    canActivate: [AuthExpGuard],
    path: '',
    component: BaseComponent,
    children: routes
  }
];


@NgModule({
  imports: [ RouterModule.forRoot(routeWrapper) ],
  exports: [ RouterModule ],
  providers: [
    AuthExpGuard,
    AuthGuard,
    CanDeactivateGuard,
    UserResolver,
    LoggedUserResolver,
    LoggedUserTagsResolver,
    ContactResolver,
    ThreadsResolver,
    MessagesResolver,
    TagResolver,
    TagsRelatedToMyTagsResolver,
    TagsRelatedToTagResolver,
    RandomTagsResolver,
    PeopleWithMyTagsResolver,
    PeopleWithTagResolver,
    NewPeopleResolver,
    IdeaResolver,
    IdeaTagsResolver,
    IdeaCommentsResolver,
    IdeasWithMyTagsResolver,
    IdeasWithTagResolver,
    NewIdeasResolver,
    AuthService,
    ModelService
  ]
})
export class AppRoutingModule { }
