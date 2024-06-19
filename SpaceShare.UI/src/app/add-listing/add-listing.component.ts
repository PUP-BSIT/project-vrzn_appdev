import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
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
  images: { file: File, preview: string }[] = [];
  regions: Region[] = [];
  cities: City[] = [];
  fileError: string | null = null;
  submissionSuccess: boolean = false;
  maxImages: number = 4; 
  imageLimitExceeded: boolean = false; // Flag to show image limit exceeded alert

  defaultRegionCode: string = '13';
  selectedProvince: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private addListingService: AddListingService,
    private locationService: LocationService,
  ) {}

  ngOnInit(): void {
    this.propertyForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
      price: ['', [Validators.required, this.priceValidator]],
      bedroom: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1), Validators.max(50)]],
      area: ['', [Validators.required, Validators.min(80), Validators.max(1000)]],
      description: ['', [Validators.required, Validators.maxLength(300)]],
      region: [this.defaultRegionCode, Validators.required],
      city: ['', Validators.required],
      postal_code: ['', [ 
        Validators.required, 
        Validators.pattern(/^\d{4}$/)
      ]],
      barangay: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(70)]],
      files: ['', Validators.required],
    });

    this.loadCitiesByRegion(this.defaultRegionCode);
  }

  priceValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value;
    if (isNaN(value) || value < 0.01 || value > 10000000) {
      return { priceInvalid: true };
    }
    return null;
  }

  get titleControl(): AbstractControl {
    return this.propertyForm.get('title')!;
  }

  get priceControl(): AbstractControl {
    return this.propertyForm.get('price')!;
  }

  get capacityControl(): AbstractControl {
    return this.propertyForm.get('capacity')!;
  }

  get bedroomControl(): AbstractControl {
    return this.propertyForm.get('bedroom')!;
  }

  get areaControl(): AbstractControl {
    return this.propertyForm.get('area')!;
  }

  get descriptionControl(): AbstractControl {
    return this.propertyForm.get('description')!;
  }

  get filesControl(): AbstractControl {
    return this.propertyForm.get('files')!;
  }

  get cityControl(): AbstractControl {
    return this.propertyForm.get('city')!;
  }

  get postalCodeControl(): AbstractControl {
    return this.propertyForm.get('postal_code')!;
  }

  get barangayControl(): AbstractControl {
    return this.propertyForm.get('barangay')!;
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
      const validFileTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
      const files = Array.from(event.target.files) as File[];
      const validFiles = files.filter(file => validFileTypes.includes(file.type));

      // Check if exceeding maximum number of images
      if (validFiles.length + this.images.length > this.maxImages) {
        this.imageLimitExceeded = true;
        return;
      } else {
        this.imageLimitExceeded = false;
      }
      
      if (validFiles.length !== files.length) {
        this.fileError = 'Some files have invalid formats. Only JPEG, PNG, GIF, and SVG formats are allowed.';
      } else {
        this.fileError = null;
      }

      this.images = [
        ...this.images,
        ...validFiles.map(file => ({
          file,
          preview: URL.createObjectURL(file)
        }))
      ];

      this.propertyForm.patchValue({
        files: this.images.map(image => image.file)
      });
      this.propertyForm.get('files')!.updateValueAndValidity();
    }
  }

  removeImage(index: number): void {
    this.images.splice(index, 1);
    this.propertyForm.patchValue({
      files: this.images.map(image => image.file)
    });
    this.propertyForm.get('files')!.updateValueAndValidity();
  }

  onSubmit(): void {
    if (!this.propertyForm.valid) return;

    const selectedRegion = this.regions.find(r => r.region_code === this.defaultRegionCode)?.region_name;

    const propertyData: Property = {
      ...this.propertyForm.value,
      region: selectedRegion || 'National Capital Region (NCR)',
    };

    const files: File[] = this.images.map(image => image.file);
    this.addListingService.createProperty(propertyData, files).subscribe({
      next: data => {
        console.log(data);
        this.submissionSuccess = true;

        setTimeout(() => {
          this.submissionSuccess = false;
        }, 2000);

        this.propertyForm.reset();
        this.images = [];
      },
      error: err => {
        console.error(err);
        this.submissionSuccess = false;
      }
    });
  }
}
