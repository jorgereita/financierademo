import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisorseguimientosComponent } from './supervisorseguimientos.component';

describe('SupervisorseguimientosComponent', () => {
  let component: SupervisorseguimientosComponent;
  let fixture: ComponentFixture<SupervisorseguimientosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupervisorseguimientosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisorseguimientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
