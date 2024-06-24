import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardSkeletonComponent } from './card-skeleton.component';

describe('CardSkeletonComponent', () => {
  let component: CardSkeletonComponent;
  let fixture: ComponentFixture<CardSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardSkeletonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
