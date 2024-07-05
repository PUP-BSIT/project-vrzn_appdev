import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { RatingService } from './rating.service';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css'
})
export class RatingComponent {
  @ViewChild('ratingModal') ratingModal!: ElementRef<HTMLDialogElement>;
  @Input() propertyId!: number;
  rating = 2;
  submitted = false;
  success = false;
  error = false;

  constructor(private ratingService: RatingService){}

  openModal() {
    this.ratingModal.nativeElement.showModal();
  }

  closeModal() {
    this.ratingModal.nativeElement.close();
  }

  submitRating(){
    this.submitted = true;

    const ratingToPass = {
      id: +this.propertyId,
      rating: +this.rating,
    }

    this.ratingService.rateProperty(ratingToPass).subscribe({
      next: data => {
        console.log(data);
        this.submitted = false;
        this.success = true;
      },
      error: () => {
        this.submitted = false;
        this.error = true;
      }
    })

    this.ratingModal.nativeElement.close();
  }

}
