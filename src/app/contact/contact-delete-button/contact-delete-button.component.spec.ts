import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactDeleteButtonComponent } from './contact-delete-button.component';

import { MaterialModule } from '@angular/material';
import { Router } from '@angular/router';

import { ModelService } from '../../model.service';
import { RouterStub } from '../../../testing/router-stubs';

class ModelStubService { }

describe('ContactDeleteButtonComponent', () => {
  let component: ContactDeleteButtonComponent;
  let fixture: ComponentFixture<ContactDeleteButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactDeleteButtonComponent ],
      imports: [
        MaterialModule
      ],
      providers: [
        { provide: ModelService, useClass: ModelStubService },
        { provide: Router, useClass: RouterStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactDeleteButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
