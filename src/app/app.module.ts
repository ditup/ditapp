import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';

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
    TagEditComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    MaterialModule.forRoot(), // angular material material.angular.io
    AppRoutingModule,
    SimpleNotificationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
