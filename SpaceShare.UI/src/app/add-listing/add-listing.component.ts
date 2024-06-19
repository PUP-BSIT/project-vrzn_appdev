import { Component, OnInit } from '@angular/core';
import {   
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators, } from '@angular/forms';
import { AddListingService } from './add-listing.service';
import { Property } from '../../model/property.model';
import { LocationService } from '../landing/register/location.service';
import { Region, City } from '../../model/location.model';

@Component({
  selector: 'app-add-listing',
  templateUrl: './add-listing.component.html',
  styleUrls: ['./add-listing.component.css'],
})
export class AddListingComponent implements OnInit {
  propertyForm!: FormGroup;
  images: File[] = [];
  regions: Region[] = [];
  cities: City[] = [];

  defaultRegionCode: string = '13'; 
  selectedProvince: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private addListingService: AddListingService,
    private locationService: LocationService,
  ) {}

  ngOnInit(): void {
    this.propertyForm = this.formBuilder.group({
      title: ['', 
          [Validators.required,
          Validators.minLength(5),
          Validators.maxLength(30)]],
      price: ['', Validators.required],
      bedroom: ['', Validators.required],
      capacity: ['', Validators.required],
      area: ['', Validators.required],
      description: [],
      region: [this.defaultRegionCode, Validators.required], 
      city: ['', Validators.required],
      postal_code: ['', Validators.required],
      barangay: ['', Validators.required],
      files: ['', Validators.required],
    });

    this.loadCitiesByRegion(this.defaultRegionCode);
  }

  get titleControl(): AbstractControl {
    return this.propertyForm.get('title')!;
  }
  

  loadCitiesByRegion(regionCode: string): void {
    this.locationService.getCities().subscribe((data: City[]) => {
      this.cities = data.filter(
        (entry: City) => entry.province_code.startsWith(regionCode)
      );
    });
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.images = Array.from(event.target.files);
      this.propertyForm.patchValue({
        files: this.images
      });
      this.propertyForm.get('files')!.updateValueAndValidity();
    }
  }

  onSubmit() {
    if (!this.propertyForm.valid) return;

    // Get the selected region name based on defaultRegionCode
    const selectedRegion = this.regions.find(r => r.region_code === this.defaultRegionCode)?.region_name;

    const propertyData: Property = {
      ...this.propertyForm.value,
      region: selectedRegion || 'National Capital Region (NCR)', 
    };

    const files: File[] = this.images;
    this.addListingService.createProperty(propertyData, files).subscribe(data => 
      console.log(data)
    );
  }
}
