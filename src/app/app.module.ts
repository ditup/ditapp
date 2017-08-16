import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DndModule } from 'ng2-dnd';
import { MarkdownModule } from 'angular2-markdown';
import { MomentModule } from 'angular2-moment';

import 'hammerjs';  // for angular material

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SignupComponent } from './signup/signup.component';
import { MainComponent } from './main/main.component';
import { FofComponent } from './fof/fof.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { LoginBasicComponent } from './login-basic/login-basic.component';
import { HeaderComponent } from './header/header.component';
import { UserComponent } from './user/user.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { TagComponent } from './tag/tag.component';
import { UserEditTagsComponent } from './user-edit/user-edit-tags/user-edit-tags.component';
import { TagStoryFormComponent } from './user-edit/user-edit-tags/tag-story-form/tag-story-form.component';
import { UserTagDetailComponent } from './shared/user-tag-detail/user-tag-detail.component';
import { PeopleComponent } from './people/people.component';
import { TagAutocompleteComponent } from './shared/tag-autocomplete/tag-autocomplete.component';
import { UserSmallComponent } from './shared/user-small/user-small.component';
import { UserTagListComponent } from './shared/user-tag-list/user-tag-list.component';
import { SelectFromMyTagsComponent } from './shared/select-from-my-tags/select-from-my-tags.component';
import { MessagesWithUserComponent } from './messages-with-user/messages-with-user.component';
import { MessageFormComponent } from './messages-with-user/message-form/message-form.component';
import { LoggedComponent } from './main/logged/logged.component';
import { NotLoggedComponent } from './main/not-logged/not-logged.component';
import { MapComponent } from './map/map.component';
import { UserEditLocationComponent } from './user-edit/user-edit-location/user-edit-location.component';
import { MessagesComponent } from './messages/messages.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ResetPasswordUpdateComponent } from './reset-password-update/reset-password-update.component';
import { AccountComponent } from './account/account.component';
import { ChangeEmailComponent } from './account/change-email/change-email.component';
import { ContactsComponent } from './user/contacts/contacts.component';
import { ProfileComponent } from './user/profile/profile.component';
import { ContactRequestSendComponent } from './contact/contact-request-send/contact-request-send.component';
import { ContactRequestUpdateComponent } from './contact/contact-request-update/contact-request-update.component';
import { ContactRequestProcessComponent } from './contact/contact-request-process/contact-request-process.component';
import { ContactUpdateComponent } from './contact/contact-update/contact-update.component';
import { ContactOverviewComponent } from './contact/contact-overview/contact-overview.component';
import { ContactFormComponent } from './contact/contact-form/contact-form.component';
import { ContactDeleteButtonComponent } from './contact/contact-delete-button/contact-delete-button.component';
import { ManageContactComponent } from './contact/manage-contact/manage-contact.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { AvatarComponent } from './shared/avatar/avatar.component';
import { LocationComponent } from './shared/location/location.component';
import { UserContactComponent } from './user/contacts/user-contact/user-contact.component';
import { UserEditProfileComponent } from './user-edit/user-edit-profile/user-edit-profile.component';
import { SelectLocationComponent } from './shared/select-location/select-location.component';
import { UserCardComponent } from './shared/user-card/user-card.component';
import { TagsComponent } from './tags/tags.component';
import { TagsRelatedToMyTagsComponent } from './tags/tags-related-to-my-tags/tags-related-to-my-tags.component';
import { TagsRelatedToTagsComponent } from './tags/tags-related-to-tags/tags-related-to-tags.component';
import { TagsNewComponent } from './tags/tags-new/tags-new.component';
import { TagsRandomComponent } from './tags/tags-random/tags-random.component';
import { TagListComponent } from './shared/tag-list/tag-list.component';
import { SelectTagsComponent } from './shared/select-tags/select-tags.component';
import { PeopleWithTagsComponent } from './people/people-with-tags/people-with-tags.component';
import { PeopleWithMyTagsComponent } from './people/people-with-my-tags/people-with-my-tags.component';
import { PeopleNewComponent } from './people/people-new/people-new.component';
import { PeopleRandomComponent } from './people/people-random/people-random.component';
import { UserListWithTagsComponent } from './shared/user-list-with-tags/user-list-with-tags.component';
import { TagRelatedTagsComponent } from './tag/tag-related-tags/tag-related-tags.component';
import { TagRelatedPeopleComponent } from './tag/tag-related-people/tag-related-people.component';
import { ChangePasswordComponent } from './account/change-password/change-password.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    MainComponent,
    FofComponent,
    VerifyEmailComponent,
    LoginBasicComponent,
    HeaderComponent,
    UserComponent,
    UserEditComponent,
    TagComponent,
    UserEditTagsComponent,
    TagStoryFormComponent,
    UserTagDetailComponent,
    PeopleComponent,
    TagAutocompleteComponent,
    UserSmallComponent,
    UserTagListComponent,
    SelectFromMyTagsComponent,
    MessagesWithUserComponent,
    MessageFormComponent,
    LoggedComponent,
    NotLoggedComponent,
    MapComponent,
    UserEditLocationComponent,
    MessagesComponent,
    ResetPasswordComponent,
    ResetPasswordUpdateComponent,
    AccountComponent,
    ChangeEmailComponent,
    ContactsComponent,
    ProfileComponent,
    ContactRequestSendComponent,
    ContactRequestUpdateComponent,
    ContactRequestProcessComponent,
    ContactUpdateComponent,
    ContactOverviewComponent,
    ContactFormComponent,
    ContactDeleteButtonComponent,
    ManageContactComponent,
    NotificationsComponent,
    AvatarComponent,
    LocationComponent,
    UserContactComponent,
    UserEditProfileComponent,
    SelectLocationComponent,
    UserCardComponent,
    TagsComponent,
    TagsRelatedToMyTagsComponent,
    TagsRelatedToTagsComponent,
    TagsNewComponent,
    TagsRandomComponent,
    TagListComponent,
    SelectTagsComponent,
    PeopleWithTagsComponent,
    PeopleWithMyTagsComponent,
    PeopleNewComponent,
    PeopleRandomComponent,
    UserListWithTagsComponent,
    TagRelatedTagsComponent,
    TagRelatedPeopleComponent,
    ChangePasswordComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpModule,
    MaterialModule, // angular material material.angular.io
    AppRoutingModule,
    DndModule.forRoot(), // drag and drop: ng2-dnd
    MarkdownModule,
    MomentModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    TagStoryFormComponent,
    UserTagDetailComponent,
    SelectFromMyTagsComponent
  ]
})
export class AppModule { }
