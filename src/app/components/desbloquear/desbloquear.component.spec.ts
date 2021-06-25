import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesbloquearComponent } from './desbloquear.component';

describe('DesbloquearComponent', () => {
  let component: DesbloquearComponent;
  let fixture: ComponentFixture<DesbloquearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesbloquearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesbloquearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
