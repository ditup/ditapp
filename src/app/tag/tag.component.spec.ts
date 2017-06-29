/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialModule } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { Observable } from 'rxjs/Observable';

import { TagComponent } from './tag.component';
import { FofComponent } from '../fof/fof.component';

class ActivatedRouteStub {
  data = Observable.of({ tag: {} });
}

describe('TagComponent', () => {
  let component: TagComponent;
  let fixture: ComponentFixture<TagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TagComponent,
        FofComponent
      ],
      imports: [MaterialModule, BrowserAnimationsModule],
      providers: [
        { provide: ActivatedRoute, useClass: ActivatedRouteStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
