import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentingComponent } from './renting.component';

describe('RentingComponent', () => {
  let component: RentingComponent;
  let fixture: ComponentFixture<RentingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RentingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RentingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
