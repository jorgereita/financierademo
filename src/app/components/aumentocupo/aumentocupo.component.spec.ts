import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AumentocupoComponent } from './aumentocupo.component';

describe('AumentocupoComponent', () => {
  let component: AumentocupoComponent;
  let fixture: ComponentFixture<AumentocupoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AumentocupoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AumentocupoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
