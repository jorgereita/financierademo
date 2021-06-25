import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteJefeventasComponent } from './reporte-jefeventas.component';

describe('ReporteJefeventasComponent', () => {
  let component: ReporteJefeventasComponent;
  let fixture: ComponentFixture<ReporteJefeventasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteJefeventasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteJefeventasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
