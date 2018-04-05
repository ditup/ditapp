import { AfterViewInit, ChangeDetectorRef, Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';

import { UserDialogComponent } from '../shared/user-dialog/user-dialog.component';
import { FooterControlService } from '../footer/footer-control.service';

import { Map, LatLng, TileLayer, Marker } from 'leaflet';
import * as L from 'leaflet';
// import { MarkerClusterGroup } from 'leaflet.markercluster';
import 'leaflet.markercluster';
import { inRange } from 'lodash';

import { ModelService } from '../model.service';
import { User } from 'app/models/user';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {

  public mapHeight: number; // = window.innerHeight - 64;
  public user: User;
  public hasLocation: boolean;

  @ViewChild('mapContainer')
  mapContainer: ElementRef;

  private userDetailDialogRef: MatDialogRef<UserDialogComponent>;
  private map: Map;
  private markers: any; // MarkerClusterGroup;
  private userIcon = L.icon({
    iconUrl: '/static/img/user-icon.svg',
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
  private subscription: Subscription;

  constructor(private footerControl: FooterControlService,
              private model: ModelService,
              private ref: ChangeDetectorRef,
              private route: ActivatedRoute,
              private dialog: MatDialog) {}

  ngOnInit() {
    // hide footer
    this.footerControl.display(false);
  }

  ngAfterViewInit() {
    this.route.data.subscribe(({ user }) => {
      // timeout helps wait until the whole view is initialized. To get the correct map container's height
      // it also helps avoid ExpressionChangedAfterItHasBeenChecked error
      setTimeout(async () => {
        this.user = user;
        this.hasLocation = Array.isArray(this.user.location) && this.user.location.length === 2;

        // read a stored map position
        const { center = null, zoom } = this.getStoredView() || { zoom: 4 };

        // move map to stored position, or to user's location or to default location
        const [lat, lon]: [number, number] = (center)
          ? center
          : (this.hasLocation)
            ? this.user.location
            : [50, 0];

        await this.initMap(lat, lon, zoom);
      }, 0);
    });
  }

  private async initMap(lat: number = 50, lon: number = 0, zoom: number = 4) {
    this.fitMapToPage();

    // update the map container native element's height
    this.ref.detectChanges();

    this.map = new Map(this.mapContainer.nativeElement, {
      center: new LatLng(lat, lon),
      zoom,
      layers: [
        new TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: 'Open Street Map',
          noWrap: true
        })
      ],
      attributionControl: false
    });

    this.map.on('moveend', async () => {
      this.moveMapInRange();
      this.storeCurrentView();
      await this.findAndUpdateUsers();
    });

    await this.findAndUpdateUsers();
  }

  private storeCurrentView() {
    const zoom = this.map.getZoom();
    const { lat, lng } = this.map.getCenter();
    const center = [lat, lng];

    localStorage.setItem('map', JSON.stringify({ center, zoom }));
  }

  private getStoredView(): any {
    return JSON.parse(localStorage.getItem('map') || null);
  }

  gotoMyLocation() {
    this.map.setView(this.user.location, this.map.getZoom(), { animate: true });
  }

  ngOnDestroy() {
    // destroy the map
    this.map.remove();

    // cancel all ongoing requests when leaving
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    // display footer back
    this.footerControl.display(true);
  }

  private moveMapInRange() {
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
            title: user.id,
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

    component.userTags = await this.model.readUserTags(user.id);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.fitMapToPage();
  }

  public mapClicked(event) {
    console.log(event);
  }

}
