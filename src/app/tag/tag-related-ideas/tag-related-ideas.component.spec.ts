import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';

import { TagRelatedIdeasComponent } from './tag-related-ideas.component';
import { MaterialModule } from 'app/material.module';

class ActivatedRouteStub {
  data = Observable.of({ ideas: [
    { id: '1' }
  ] });
}

describe('TagRelatedIdeasComponent', () => {
  let component: TagRelatedIdeasComponent;
  let fixture: ComponentFixture<TagRelatedIdeasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagRelatedIdeasComponent ],
      imports: [
        MaterialModule,
        RouterTestingModule
      ],
      providers: [
        { provide: ActivatedRoute, useClass: ActivatedRouteStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagRelatedIdeasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
