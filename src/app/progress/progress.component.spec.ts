import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialModule } from '../material.module';

import { ProgressComponent } from './progress.component';
import { ProgressService } from './progress.service';

describe('ProgressComponent', () => {
  let component: ProgressComponent;
  let fixture: ComponentFixture<ProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgressComponent ],
      imports: [
        MaterialModule
      ],
      providers: [
        ProgressService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
