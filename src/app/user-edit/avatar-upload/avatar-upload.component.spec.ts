import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { By } from '@angular/platform-browser';

import { AvatarUploadComponent } from './avatar-upload.component';
import { AuthService } from '../../auth.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { HeaderControlService } from '../../header-control.service';
import * as config from '../../config';

const TOKEN = [
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  'eyJ1c2VybmFtZSI6InVzZXIwIiwiZW1haWxfdmVyaWZpZWQiOnRydWV9',
  'yGU-p9O7Q4lP-vrWP9GigxDaJHBS0Rxd2aVvf2eniQA'
].join('.');

class AuthStubService {
  token = TOKEN;

  username = 'user0';
}

// tslint:disable-next-line:component-selector
@Component({ selector: 'fancy-image-uploader', template: '' })
class FancyImageUploaderStubComponent {
  @Input() options;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onUpload = new EventEmitter<any>();
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onError = new EventEmitter<any>();
}

describe('AvatarUploadComponent', () => {
  let component: AvatarUploadComponent;
  let fixture: ComponentFixture<AvatarUploadComponent>;
  let uploadComponent: FancyImageUploaderStubComponent;

  let notifyInfoSpy: jasmine.Spy;
  let notifyErrorSpy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AvatarUploadComponent,
        FancyImageUploaderStubComponent
      ],
      providers: [
        { provide: AuthService, useClass: AuthStubService },
        NotificationsService,
        HeaderControlService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvatarUploadComponent);
    component = fixture.componentInstance;
    uploadComponent = fixture.debugElement.query(By.css('fancy-image-uploader')).componentInstance;
    fixture.detectChanges();

    // spy on notifications service
    const notify = fixture.debugElement.injector.get(NotificationsService);
    notifyInfoSpy = spyOn(notify, 'info');
    notifyErrorSpy = spyOn(notify, 'error');
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('fancy image uploader should be provided with correct options', () => {

    expect(uploadComponent.options).toEqual({
      uploadUrl: `${config.api.baseUrl}/users/user0/avatar`,
      httpMethod: 'PATCH',
      authTokenPrefix: 'Bearer',
      authToken: TOKEN,
      customHeaders: {
        Accept: 'application/vnd.api+json'
      },
      fieldName: 'avatar',
      autoUpload: true,
      maxImageSize: 2,
      allowedImageTypes: [ 'image/png', 'image/jpeg' ]
    });

  });

  it('successful upload should be notified', () => {
    uploadComponent.onUpload.emit({ status: 204 });
    fixture.detectChanges();

    expect(notifyInfoSpy.calls.count()).toEqual(1);
    expect(notifyInfoSpy.calls.first().args[0]).toEqual('Your profile picture was changed.');
  });

  it('upload error should be notified', () => {
    uploadComponent.onUpload.emit({ status: 400 });
    fixture.detectChanges();

    expect(notifyErrorSpy.calls.count()).toEqual(1);
    expect(notifyErrorSpy.calls.first().args[0]).toEqual('Upload failed with status 400');
  });
});
