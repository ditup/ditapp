import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';

import * as _ from 'lodash';
import { Map, LatLng, TileLayer, Circle, Marker } from 'leaflet';
import * as L from 'leaflet';
import { MarkerClusterGroup } from 'leaflet.markercluster';
import 'leaflet.markercluster';

import { ModelService } from '../model.service';
import { User } from '../shared/types';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  public mapHeight: number = window.innerHeight;

  @ViewChild('mapContainer')
  mapContainer: ElementRef;

  private map: Map;
  private markers: MarkerClusterGroup;
  private userIcon = L.icon({
    iconUrl: '/static/img/user-icon.svg'
  });

  public loadingUsers: boolean = false;

  constructor(private model: ModelService) {}

  async ngOnInit() {
    this.fitMapToPage();

    this.map = new Map(this.mapContainer.nativeElement, {
      center: new LatLng(50, 0),
      zoom: 6,
      layers: [
        new TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: 'Open Street Map'
        })
      ],
      attributionControl: false
    });

    await this.findAndUpdateUsers();

    this.map.on('moveend', async (evt) => {
      console.log('moving map', evt);
      await this.findAndUpdateUsers();
    });
  }

  private async findAndUpdateUsers() {
    this.setLoadingUsers(true);
    const rawBounds = this.map.getBounds();

    const sw = rawBounds.getSouthWest();
    const ne = rawBounds.getNorthEast();

    const users = await this.model.findUsersWithinRectangle(sw, ne);

    // remove the previous markers
    if (this.markers as Boolean) {
      this.map.removeLayer(this.markers);
    }

    // add the new markers
    this.markers = L['markerClusterGroup']({
      maxClusterRadius: 40
    });

    _.each(users, (user) => {
      const marker = new Marker(new LatLng(user.location[0], user.location[1]), {
        title: user.username,
        icon: this.userIcon
      });

      marker.on('click', () => {
        console.log('clicked', user.username);
      });

      this.markers.addLayer(marker);
    });

    this.map.addLayer(this.markers);

    this.setLoadingUsers(false);
  }

  private setLoadingUsers(loading: boolean) {
    this.loadingUsers = loading;
    this.fitMapToPage();
  }

  private fitMapToPage() {
    this.mapHeight = window.innerHeight - this.mapContainer.nativeElement.offsetTop;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.fitMapToPage();
  }

  public mapClicked(event) {
    console.log(event);
  }

}
