import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectLocationComponent } from './select-location.component';
import { NotificationsService } from 'app/notifications/notifications.service';

describe('SelectLocationComponent', () => {
  let component: SelectLocationComponent;
  let fixture: ComponentFixture<SelectLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectLocationComponent ],
      providers: [
        NotificationsService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
