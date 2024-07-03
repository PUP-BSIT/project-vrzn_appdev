import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReserveComponent } from './reserve.component';

describe('ReserveComponent', () => {
  let component: ReserveComponent;
  let fixture: ComponentFixture<ReserveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReserveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReserveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
