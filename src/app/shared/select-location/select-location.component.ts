import { Component, OnInit, Input, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';

import { inRange } from 'lodash';

import { LatLng, Map, TileLayer } from 'leaflet';
import 'leaflet';

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
  public location: [number, number] = [0, 0];

  @Input() disabled = false;

  @Output()
  public onSubmit = new EventEmitter<[number, number]>();

  constructor() { }

  ngOnInit() {
    this.map = new Map(this.locationContainer.nativeElement, {
      center: new LatLng(this.location[0] || 0, this.location[1] || 0),
      zoom: 6,
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

    this.onSubmit.emit(location);
  }

}
