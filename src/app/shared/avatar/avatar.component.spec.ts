import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarComponent } from './avatar.component';

import { ModelService } from '../../model.service';

class ModelStubService {
  async readAvatar(_username: string) { }
}

describe('AvatarComponent', () => {
  let component: AvatarComponent;
  let fixture: ComponentFixture<AvatarComponent>;

  let readAvatarSpy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvatarComponent ],
      providers: [
        { provide: ModelService, useClass: ModelStubService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvatarComponent);
    component = fixture.componentInstance;

    // spy on model's readAvatar(username);
    const model = fixture.debugElement.injector.get(ModelService);
    readAvatarSpy = spyOn(model, 'readAvatar');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reload the avatar when calling the reload function', async(async () => {

    // avatar was loaded at the beginning
    expect(readAvatarSpy.calls.count()).toEqual(1);

    readAvatarSpy.calls.reset();

    await component.reload();

    expect(readAvatarSpy.calls.count()).toEqual(1);
  }));
});
