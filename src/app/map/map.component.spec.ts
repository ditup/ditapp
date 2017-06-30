import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapComponent } from './map.component';

import { MaterialModule } from '@angular/material';
import { Observable } from 'rxjs/Observable';

import { ModelService } from '../model.service';

class ModelStubService {
  findUsersWithinRectangle() {
    return Observable.of([]);
  }
}

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapComponent ],
      imports: [
        MaterialModule
      ],
      providers: [
        { provide: ModelService, useClass: ModelStubService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
