import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefinicionesComponent } from './definiciones.component';

describe('DefinicionesComponent', () => {
  let component: DefinicionesComponent;
  let fixture: ComponentFixture<DefinicionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefinicionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefinicionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
