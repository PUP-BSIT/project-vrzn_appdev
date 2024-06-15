import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddListingService } from './add-listing.service';
import { Property } from '../../model/property.model';

@Component({
  selector: 'app-add-listing',
  templateUrl: './add-listing.component.html',
  styleUrl: './add-listing.component.css',
})
export class AddListingComponent implements OnInit {
  propertyForm!: FormGroup;
  images: File[] = [];

  constructor(private formBuilder: FormBuilder, private addListingService: AddListingService) {}

  ngOnInit(): void {
    this.propertyForm = this.formBuilder.group({
      title: ['', Validators.required],
      price: ['', Validators.required],
      bedroom: ['', Validators.required],
      capacity: ['', Validators.required],
      area: ['', Validators.required],
      description: [],
      region: ['', Validators.required],
      city: ['', Validators.required],
      postal_code: ['', Validators.required],
      barangay: ['', Validators.required],
      files: ['', Validators.required],
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
    if(!this.propertyForm.valid) return;
    const propertyData: Property = this.propertyForm.value;
    const files: File[] = this.images;
    this.addListingService.createProperty(propertyData, files).subscribe(data => 
      console.log(data)
    )
  }
}
