import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../auth.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { HeaderControlService } from '../../header-control.service';
import { api } from '../../config';

import { FancyImageUploaderOptions, UploadedFile } from 'ng2-fancy-image-uploader';

@Component({
  selector: 'app-avatar-upload',
  templateUrl: './avatar-upload.component.html',
  styleUrls: ['./avatar-upload.component.scss']
})
export class AvatarUploadComponent implements OnInit {

  // options for ng2-fancy-image-uploader
  get uploaderOptions(): FancyImageUploaderOptions {
    return{
      uploadUrl: `${api.baseUrl}/users/${this.auth.username}/avatar`,
      httpMethod: 'PATCH',
      authTokenPrefix: 'Bearer',
      authToken: this.auth.token,
      fieldName: 'avatar',
      autoUpload: true,
      maxImageSize: 2,
      allowedImageTypes: ['image/png', 'image/jpeg']
    };
  }

  constructor(private auth: AuthService,
              private notify: NotificationsService,
              private headerControl: HeaderControlService) { }

  ngOnInit() {
  }

  // success event of ng2-fancy-image-uploader
  onUpload(_file: UploadedFile) {
    this.notify.info('Your profile picture was changed.');
    this.headerControl.updateAvatar();
  }

  // error event of ng2-fancy-image-uploader
  onError(err) {
    this.notify.error(err.message || err);
  }

  /*
   * unused version using model.updateAvatar
   */
  /*
  public onFileChanged = this.onClickUpload;

  public async onClickUpload() {
    const file: File = this.fileInputElement.nativeElement.files[0];
    console.log(file);
    await this.uploadImage(file);
  }

  private async uploadImage(path) {
    await this.model.updateAvatar(path);
  }
  */

}
