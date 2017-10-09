import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagAutocompleteComponent } from './tag-autocomplete.component';

import { MaterialModule } from '../../material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { ModelService } from '../../model.service';

class ModelStubService {
  readTagsLike() {}
}

describe('TagAutocompleteComponent', () => {
  let component: TagAutocompleteComponent;
  let fixture: ComponentFixture<TagAutocompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagAutocompleteComponent ],
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: ModelService, useClass: ModelStubService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
