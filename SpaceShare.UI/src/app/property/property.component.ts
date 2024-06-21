import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Property } from '../../model/property.model';
import { PropertyService } from './property.service';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.css'],
})
export class PropertyComponent implements OnInit {
  propertyId!: number;
  property!: Property;

  constructor(
    private route: ActivatedRoute,
    private propertyService: PropertyService
  ) {}

  ngOnInit(): void {
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
