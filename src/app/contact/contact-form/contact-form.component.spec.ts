import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ContactFormComponent } from './contact-form.component';

import { ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../../material.module';
import { EditorComponent } from '../../shared/editor/editor.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ContactFormComponent', () => {
  let component: ContactFormComponent;
  let fixture: ComponentFixture<ContactFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ContactFormComponent,
        EditorComponent
      ],
      imports: [
        ReactiveFormsModule,
        MaterialModule,
        BrowserAnimationsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate the form data', () => {
    const submitSpy = spyOn(component.onSubmit, 'emit').and.callThrough();
    const form = fixture.debugElement.query(By.css('form'));

    // try to submit invalid form data
    form.triggerEventHandler('submit', null);
    // and don't make it possible
    expect(submitSpy.calls.count()).toEqual(0);
    //
    // try to submit valid form data
    component.contactForm.controls['trust'].setValue(2);
    fixture.detectChanges();
    form.triggerEventHandler('submit', null);
    // and succeed
    expect(submitSpy.calls.count()).toEqual(1);
  });
});
