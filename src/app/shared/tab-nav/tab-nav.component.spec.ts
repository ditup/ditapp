import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { TabNavComponent } from './tab-nav.component';

describe('TabNavComponent', () => {
  let component: TabNavComponent;
  let fixture: ComponentFixture<TabNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabNavComponent ],
      imports: [
        RouterTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
