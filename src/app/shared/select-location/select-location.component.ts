import { Component, OnInit, Input, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { inRange } from 'lodash';
import { LatLng, Map, TileLayer } from 'leaflet';
import 'leaflet';

import { NotificationsService } from 'app/notifications/notifications.service';

@Component({
  selector: 'app-select-location',
  templateUrl: './select-location.component.html',
  styleUrls: ['./select-location.component.scss']
})
export class SelectLocationComponent implements OnInit {

  @ViewChild('locationContainer')
  locationContainer: ElementRef;

  private map: Map;

  @Input()
  public location: [number, number];

  @Input() disabled = false;

  // tslint:disable-next-line:no-output-on-prefix
  @Output() public submit = new EventEmitter<[number, number]>();

  constructor(private notify: NotificationsService) { }

  ngOnInit() {
    const location = (this.location) ? this.location : [0, 0];

    const zoom = (this.location) ? 8 : 1;

    this.map = new Map(this.locationContainer.nativeElement, {
      center: new LatLng(location[0], location[1]),
      zoom,
      scrollWheelZoom: 'center', // zoom to the center point
      layers: [
        new TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: 'Open Street Map',
          noWrap: true
        })
      ],
      attributionControl: false
    });

    // if the center of the map gets outside of the world, move it back
    this.map.on('moveend', () => {
      let center = this.map.getCenter();
      while (!inRange(center.lng, -180, 180)) {
        let moveBy;
        if (center.lng > 180) {
          moveBy = -360;
        } else {
          moveBy = 360;
        }

        this.map.setView([center.lat, center.lng + moveBy],
                         this.map.getZoom(),
                         { animate: false });

        center = this.map.getCenter();
      }
    });
  }

  public updateLocation() {
    // disable the button while the location is updated
    const { lat, lng } = this.map.getCenter();
    const location: [number, number] = [lat, lng];

    // prevent saving the null island
    if (location[0] === 0 && location[1] === 0) {
      this.notify.error('Please choose a non-default location.');

      return;
    }

    this.submit.emit(location);
  }

  public removeLocation() {
    this.submit.emit(null);
  }

}
