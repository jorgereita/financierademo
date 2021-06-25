import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedrequestsComponent } from './feedrequests.component';

describe('FeedrequestsComponent', () => {
  let component: FeedrequestsComponent;
  let fixture: ComponentFixture<FeedrequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedrequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedrequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
