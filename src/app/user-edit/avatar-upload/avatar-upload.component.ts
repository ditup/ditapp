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
      allowedImageTypes: ['image/png', 'image/jpeg'],
      authToken: this.auth.token,
      authTokenPrefix: 'Bearer',
      autoUpload: true,
      customHeaders: {
        Accept: 'application/vnd.api+json'
      },
      fieldName: 'avatar',
      httpMethod: 'PATCH',
      maxImageSize: 2,
      uploadUrl: `${api.baseUrl}/users/${this.auth.username}/avatar`
    };
  }

  constructor(private auth: AuthService,
              private notify: NotificationsService,
              private headerControl: HeaderControlService) { }

  ngOnInit() {
  }

  // success event of ng2-fancy-image-uploader
  onUpload(file: UploadedFile) {
    if (file.status === 204) {
      this.notify.info('Your profile picture was changed.');
      this.headerControl.updateAvatar();
      return;
    }

    this.notify.error(`Upload failed with status ${file.status}`);
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
