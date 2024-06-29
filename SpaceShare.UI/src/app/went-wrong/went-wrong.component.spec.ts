import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WentWrongComponent } from './went-wrong.component';

describe('WentWrongComponent', () => {
  let component: WentWrongComponent;
  let fixture: ComponentFixture<WentWrongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WentWrongComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WentWrongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
