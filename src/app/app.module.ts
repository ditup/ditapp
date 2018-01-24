import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DndModule } from 'ng2-dnd';
import { MomentModule } from 'angular2-moment';
import { FancyImageUploaderModule } from 'ng2-fancy-image-uploader';

import 'hammerjs';  // for angular material

import { GlobalErrorHandler } from './error-handler';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SignupComponent } from './signup/signup.component';
import { MainComponent } from './main/main.component';
import { FofComponent } from './fof/fof.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { LoginComponent } from './login/login.component';
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

// services
import { AuthService } from './auth.service';
import { DialogService } from './dialog.service';
import { FooterControlService } from './footer/footer-control.service';
import { HeaderControlService } from './header-control.service';
import { ModelService } from './model.service';
import { NotificationsService } from './notifications/notifications.service';
import { ProgressService } from './progress/progress.service';

import { AvatarUploadComponent } from './user-edit/avatar-upload/avatar-upload.component';
import { TagRemoveConfirmComponent } from './user-edit/user-edit-tags/tag-remove-confirm/tag-remove-confirm.component';
import { UserDialogComponent } from './shared/user-dialog/user-dialog.component';
import { ProgressComponent } from './progress/progress.component';

import { HttpProgressInterceptor } from './progress/progress.interceptor';
import { EditorComponent } from './shared/editor/editor.component';
import { EditorOutputComponent } from './shared/editor-output/editor-output.component';
import { TabNavComponent } from './shared/tab-nav/tab-nav.component';
import { VerifyEmailCodeComponent } from './verify-email-code/verify-email-code.component';
import { BaseComponent } from './base/base.component';
import { FooterComponent } from './footer/footer.component';
import { IdeaFormComponent } from './ideas/idea-form/idea-form.component';
import { CreateIdeaComponent } from './ideas/create-idea/create-idea.component';
import { ReadIdeaComponent } from './ideas/read-idea/read-idea.component';
import { UpdateIdeaComponent } from './ideas/update-idea/update-idea.component';
import { VoteComponent } from './shared/vote/vote.component';
import { EditTagsComponent } from './shared/edit-tags/edit-tags.component';
import { IdeasComponent } from './ideas/ideas/ideas.component';
import { IdeasWithMyTagsComponent } from './ideas/ideas-with-my-tags/ideas-with-my-tags.component';
import { IdeaTagEditorComponent } from './ideas/idea-tag-editor/idea-tag-editor.component';
import { NewIdeasComponent } from './ideas/new-ideas/new-ideas.component';
import { CommentsComponent } from './comments/comments.component';
import { CommentComponent } from './comments/comment/comment.component';
import { CommentFormComponent } from './comments/comment-form/comment-form.component';
import { TagRelatedIdeasComponent } from './tag/tag-related-ideas/tag-related-ideas.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { WelcomeStartComponent } from './welcome/welcome-start/welcome-start.component';
import { WelcomeTagsComponent } from './welcome/welcome-tags/welcome-tags.component';
import { WelcomeInfoComponent } from './welcome/welcome-info/welcome-info.component';
import { WelcomeLocationComponent } from './welcome/welcome-location/welcome-location.component';
import { WelcomeFinishComponent } from './welcome/welcome-finish/welcome-finish.component';
import { WelcomeNavigationComponent } from './welcome/welcome-navigation/welcome-navigation.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    MainComponent,
    FofComponent,
    VerifyEmailComponent,
    LoginComponent,
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
    ChangePasswordComponent,
    AvatarUploadComponent,
    TagRemoveConfirmComponent,
    UserDialogComponent,
    ProgressComponent,
    EditorComponent,
    EditorOutputComponent,
    TabNavComponent,
    VerifyEmailCodeComponent,
    BaseComponent,
    FooterComponent,
    IdeaFormComponent,
    CreateIdeaComponent,
    ReadIdeaComponent,
    UpdateIdeaComponent,
    VoteComponent,
    EditTagsComponent,
    IdeasComponent,
    IdeasWithMyTagsComponent,
    IdeaTagEditorComponent,
    NewIdeasComponent,
    CommentsComponent,
    CommentComponent,
    CommentFormComponent,
    TagRelatedIdeasComponent,
    WelcomeComponent,
    WelcomeStartComponent,
    WelcomeTagsComponent,
    WelcomeInfoComponent,
    WelcomeLocationComponent,
    WelcomeFinishComponent,
    WelcomeNavigationComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule, // angular material material.angular.io
    AppRoutingModule,
    DndModule.forRoot(), // drag and drop: ng2-dnd
    MomentModule,
    FancyImageUploaderModule
  ],
  providers: [
    AuthService,
    DialogService,
    FooterControlService,
    HeaderControlService,
    ModelService,
    NotificationsService,
    ProgressService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpProgressInterceptor, multi: true },
    { provide: ErrorHandler, useClass: GlobalErrorHandler } // custom global error handler
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    TagStoryFormComponent,
    TagRemoveConfirmComponent,
    UserTagDetailComponent,
    UserDialogComponent,
    SelectFromMyTagsComponent
  ]
})
export class AppModule { }
