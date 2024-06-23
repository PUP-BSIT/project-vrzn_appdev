import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrationComponent } from './filtration.component';

describe('FiltrationComponent', () => {
  let component: FiltrationComponent;
  let fixture: ComponentFixture<FiltrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FiltrationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FiltrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
