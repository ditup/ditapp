import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';
import { UserDialogComponent } from '../shared/user-dialog/user-dialog.component';

import { Subscription } from 'rxjs/Subscription';
import { MdDialog, MdDialogRef } from '@angular/material';

import { Map, LatLng, TileLayer, Marker } from 'leaflet';
import * as L from 'leaflet';
// import { MarkerClusterGroup } from 'leaflet.markercluster';
import 'leaflet.markercluster';
import { inRange } from 'lodash';

import { ModelService } from '../model.service';
import { User } from '../shared/types';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {

  public mapHeight: number = window.innerHeight;

  @ViewChild('mapContainer')
  mapContainer: ElementRef;

  private userDetailDialogRef: MdDialogRef<UserDialogComponent>;
  private map: Map;
  private markers: any; // MarkerClusterGroup;
  private userIcon = L.icon({
    iconUrl: '/static/img/user-icon.svg',
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
  private subscription: Subscription;

  constructor(private model: ModelService,
              private dialog: MdDialog) {}

  async ngOnInit() {
    this.fitMapToPage();

    this.map = new Map(this.mapContainer.nativeElement, {
      center: new LatLng(50, 0),
      zoom: 6,
      layers: [
        new TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: 'Open Street Map',
          noWrap: true
        })
      ],
      attributionControl: false
    });

    this.findAndUpdateUsers();

    this.map.on('moveend', async () => {
      this.moveMapInRange();
      this.findAndUpdateUsers();
    });
  }

  ngOnDestroy() {
    // cancel all ongoing requests when leaving
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private moveMapInRange () {
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
  }

  private findAndUpdateUsers() {
    const rawBounds = this.map.getBounds();

    const sw = rawBounds.getSouthWest();
    const ne = rawBounds.getNorthEast();

    // cut out-of-range boundaries into range
    if (sw.lng < -180) { sw.lng = -180; }
    if (ne.lng > 180) { ne.lng = 180; }

    // cancel previous request
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.model.findUsersWithinRectangle(sw, ne)
      .subscribe((users: User[]) => {

        // remove the previous markers
        if (this.markers) {
          this.map.removeLayer(this.markers);
        }

        // add the new markers
        this.markers = L['markerClusterGroup']({
          maxClusterRadius: 40
        });

        users.forEach((user) => {
          const marker = new Marker(new LatLng(user.location[0], user.location[1]), {
            title: user.username,
            icon: this.userIcon
          });

          marker.on('click', () => {
            this.displayUserDetail(user);
          });

          this.markers.addLayer(marker);
        });

        this.map.addLayer(this.markers);

        if (this.subscription) {
          this.subscription.unsubscribe();
        }

      });
    return this.subscription;
  }

  private fitMapToPage() {
    this.mapHeight = window.innerHeight - this.mapContainer.nativeElement.offsetTop;
  }

  // show the detail of user
  private async displayUserDetail(user: User) {
    // open the dialog
    this.userDetailDialogRef = this.dialog.open(UserDialogComponent);
    const dialogRef = this.userDetailDialogRef;

    const component = dialogRef.componentInstance;

    // initialize the dialog with the provided user
    component.user = user;
    component.ref = dialogRef;

    component.userTags = await this.model.readUserTags(user.username);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.fitMapToPage();
  }

  public mapClicked(event) {
    console.log(event);
  }

}
