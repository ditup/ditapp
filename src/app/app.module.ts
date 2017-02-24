import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { DndModule } from 'ng2-dnd';
import { MarkdownModule } from 'angular2-markdown';

import { SimpleNotificationsModule } from 'angular2-notifications';

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
import { TagsNewComponent } from './tags-new/tags-new.component';
import { TagComponent } from './tag/tag.component';
import { TagEditComponent } from './tag-edit/tag-edit.component';
import { UserEditTagsComponent } from './user-edit/user-edit-tags/user-edit-tags.component';
import { TagsNewFormComponent } from './shared/tags-new-form/tags-new-form.component';
import { TagStoryFormComponent } from './user-edit/user-edit-tags/tag-story-form/tag-story-form.component';
import { UserTagDetailComponent } from './user/user-tag-detail/user-tag-detail.component';

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
    TagsNewComponent,
    TagComponent,
    TagEditComponent,
    UserEditTagsComponent,
    TagsNewFormComponent,
    TagStoryFormComponent,
    UserTagDetailComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    MaterialModule.forRoot(), // angular material material.angular.io
    AppRoutingModule,
    SimpleNotificationsModule,
    DndModule.forRoot(), // drag and drop: ng2-dnd
    MarkdownModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    TagsNewFormComponent,
    TagStoryFormComponent,
    UserTagDetailComponent
  ]
})
export class AppModule { }
