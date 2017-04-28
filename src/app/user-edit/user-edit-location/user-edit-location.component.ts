import { Component, OnInit, Input, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';

import { User } from '../../shared/types';
import { ModelService } from '../../model.service';

import * as _ from 'lodash';
import * as L from 'leaflet';
import { ResizeEvent } from 'leaflet';

@Component({
  selector: 'app-user-edit-location',
  templateUrl: './user-edit-location.component.html',
  styleUrls: ['./user-edit-location.component.scss']
})
export class UserEditLocationComponent implements OnInit, OnChanges {

  @ViewChild('locationContainer')
  locationContainer: ElementRef;

  private map: L.Map;

  public isButtonDisabled = true;

  constructor(private model: ModelService) { }

  @Input()
  user: User;

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    // when user changes
    if (changes['user'] && this.user.username) {
      this.map = L.map(this.locationContainer.nativeElement, {
        center: L.latLng.apply(null, this.user.preciseLocation || [0, 0]),
        zoom: 6,
        scrollWheelZoom: 'center', // zoom to the center point
        layers: [
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: 'Open Street Map',
            noWrap: true
          })
        ],
        attributionControl: false,
        // maxBounds: L.latLngBounds(L.latLng(-90, -180), L.latLng(90, 180))
      });

      this.map.invalidateSize(false);

      // enable the button
      this.isButtonDisabled = false;

      // if the center of the map gets outside of the world, move it back
      this.map.on('moveend', () => {
        let center = this.map.getCenter();
        while (!_.inRange(center.lng, -180, 180)) {
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
  }

  public async updateLocation() {
    // disable the button while the location is updated
    this.isButtonDisabled = true;

    const { lat, lng } = this.map.getCenter();
    const location: [number, number] = [lat, lng];
    await this.model.updateUser(this.user.username, { location });

    this.isButtonDisabled = false;
  }

}
