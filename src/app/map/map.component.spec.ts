import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { LatLng } from 'leaflet';

import { MapComponent } from './map.component';
import { MaterialModule } from '../material.module';
import { FooterControlService } from '../footer/footer-control.service';
import { ModelService } from '../model.service';
import { User } from '../shared/types';

class ModelStubService {
  findUsersWithinRectangle(_sw: LatLng, _ne: LatLng): Observable<User[]> {
    return Observable.of([{ username: 'test-user', location: [0, 0] as [number, number] }]);
  }
}

class ActivatedRouteStub {
  data = Observable.of({ user: {} });
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
        FooterControlService,
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
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

  it('when clicking a dot, should show a detail with user', () => {
    // TODO can't access the inner html of map layers, therefore can't click the marker
    pending();

    /*
    // note: can't access
    await fixture.whenStable();
    // find a dot
    const map = fixture.debugElement.query(By.css('.leaflet-container'));
    const panes = map.queryAll(By.css('*'));
    console.log(map, panes);
    const icons = fixture.debugElement.queryAll(By.css('.leaflet-marker-icon'));
    console.log(icons);
    // click the dot
    // expect a dialog-opening function to be called with the username
    // */
  })/*)*/;
});
