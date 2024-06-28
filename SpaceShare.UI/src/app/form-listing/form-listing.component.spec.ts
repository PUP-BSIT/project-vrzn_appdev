import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormListingComponent } from './form-listing.component';

describe('FormListingComponent', () => {
  let component: FormListingComponent;
  let fixture: ComponentFixture<FormListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormListingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
