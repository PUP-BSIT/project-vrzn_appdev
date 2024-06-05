import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealComponent } from './deal.component';

describe('DealComponent', () => {
  let component: DealComponent;
  let fixture: ComponentFixture<DealComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DealComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
