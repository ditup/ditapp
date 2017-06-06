import { Component, OnInit, OnChanges, Input, ViewChild, ElementRef, HostListener } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import * as _ from 'lodash';
import { Map, LatLng, TileLayer, Circle, Marker } from 'leaflet';
import * as L from 'leaflet';
import { MarkerClusterGroup } from 'leaflet.markercluster';
import 'leaflet.markercluster';

import { ModelService } from '../../model.service';
import { User } from '../types';

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

  ngOnChanges() {
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
      scrollWheelZoom: 'center',
      touchZoom: 'center',
      dragging: false
    });
  }
}
