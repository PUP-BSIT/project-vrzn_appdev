import { Component, OnInit } from '@angular/core';
import { Property } from '../../model/property.model';
import { ActivatedRoute } from '@angular/router';
import { PropertyService } from '../property/property.service';

@Component({
  selector: 'app-reserve',
  templateUrl: './reserve.component.html',
  styleUrls: ['./reserve.component.css'],
})
export class ReserveComponent implements OnInit {
  propertyId!: number;
  property!: Property;

  constructor(
    private route: ActivatedRoute,
    private propertyService: PropertyService
  ) {}

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.route.paramMap.subscribe((params) => {
      this.propertyId = +params.get('id')!;

      setTimeout(() => {
        this.propertyService.getProperty(this.propertyId).subscribe((data) => {
          this.property = data;
        });
      }, 1000);
    });
  }
}





