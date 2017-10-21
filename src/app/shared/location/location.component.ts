import { Component, OnInit, OnChanges, Input, ViewChild, ElementRef, SimpleChanges } from '@angular/core';

import { Map, LatLng, TileLayer, Marker } from 'leaflet';
import * as L from 'leaflet';
import 'leaflet.markercluster';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit, OnChanges {

  private map: Map;

  private locationIcon = L.icon({
    iconUrl: '/static/img/user-icon.svg',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

  @Input()
  public location: [number, number];

  @ViewChild('locationContainer')
  locationContainer: ElementRef;

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    // (re)load map when location changes
    if (changes.location && changes.location.previousValue !== changes.location.currentValue) {
      this.loadMap();
    }
  }

  private loadMap() {
    if (this.map) {
      this.map.remove();
    }

    const [lat, lng] = this.location;

    const loc = new LatLng(lat, lng);

    this.map = new Map(this.locationContainer.nativeElement, {
      center: loc,
      zoom: 6,
      minZoom: 2,
      bounceAtZoomLimits: false,
      layers: [
        new TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: 'Open Street Map'
        }),
        new Marker(loc, { icon: this.locationIcon })
      ],
      attributionControl: false,
      boxZoom: false,
      doubleClickZoom: 'center',
      scrollWheelZoom: false,
      touchZoom: 'center',
      dragging: false
    });
  }
}
