import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

import { AvatarComponent } from './avatar.component';

import { ModelService } from '../../model.service';

class ModelStubService {
  async readAvatar(_username: string) { }
}

@Component({
  template: '<app-avatar [username]="username"></app-avatar>'
})
class TestHostComponent {
  username: string;
}

describe('AvatarComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  let readAvatarSpy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvatarComponent, TestHostComponent ],
      providers: [
        { provide: ModelService, useClass: ModelStubService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;

    component.username = 'test-user';

    // spy on model's readAvatar(username);
    const model = fixture.debugElement.injector.get(ModelService);
    readAvatarSpy = spyOn(model, 'readAvatar');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reload the avatar when changing username', () => {

    // avatar was loaded at the beginning
    expect(readAvatarSpy.calls.count()).toEqual(1);

    readAvatarSpy.calls.reset();

    component.username = 'other-user';
    fixture.detectChanges();

    expect(readAvatarSpy.calls.count()).toEqual(1);
  });

  it('should reload the avatar when calling the reload function', async(async () => {
    const avatarComponent: AvatarComponent = fixture.debugElement.query(By.css('app-avatar')).componentInstance;

    // avatar was loaded at the beginning
    expect(readAvatarSpy.calls.count()).toEqual(1);

    readAvatarSpy.calls.reset();

    await avatarComponent.reload();

    expect(readAvatarSpy.calls.count()).toEqual(1);
  }));
});
