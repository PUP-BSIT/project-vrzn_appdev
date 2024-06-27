import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddListingService } from './add-listing.service';
import { Property } from '../../model/property.model';
import { LocationService } from '../landing/register/location.service';
import { Region, City } from '../../model/location.model';
import { ActivatedRoute } from '@angular/router';
import { PropertyService } from '../property/property.service';
import { every, forkJoin, map, Observable } from 'rxjs';

@Component({
  selector: 'app-add-listing',
  templateUrl: './add-listing.component.html',
  styleUrls: ['./add-listing.component.css'],
})
export class AddListingComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  createdPropertyId!: number;

  propertyForm!: FormGroup;
  images: { file: File; preview: string }[] = [];
  regions: Region[] = [];
  cities: City[] = [];
  fileError: string | null = null;
  submitted = false;
  submissionSuccess = false;
  maxImages = 4;
  imageLimitExceeded = false;
  submitButtonDisabled = false;

  defaultRegionCode = '13';
  selectedProvince = '';

  title = 'Add new listing';
  isEditing = false;
  idToEdit!: number;
  propertyToEdit!: Property;
  initialImages!: FileList;

  constructor(
    private formBuilder: FormBuilder,
    private addListingService: AddListingService,
    private locationService: LocationService,
    private route: ActivatedRoute,
    private propertyService: PropertyService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadCitiesByRegion(this.defaultRegionCode);
    this.route.paramMap.subscribe((params) => {
      if (+params.get('id')!) {
        this.title = 'Edit Listing';
        this.idToEdit = +params.get('id')!;
        this.isEditing = true;
        this.loadPropertyToEdit();
      }
    });
  }

  initializeForm(): void {
    this.propertyForm = this.formBuilder.group({
      title: [
        this.isEditing ? this.propertyToEdit.title : '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(30),
        ],
      ],
      price: ['', [Validators.required, this.priceValidator]],
      bedroom: ['', Validators.required],
      capacity: [
        '',
        [Validators.required, Validators.min(1), Validators.max(50)],
      ],
      area: ['', [Validators.required, Validators.min(10), Validators.max(60)]],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(220),
          Validators.maxLength(320),
        ],
      ],
      region: [this.defaultRegionCode],
      city: ['', Validators.required],
      postal_code: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
      barangay: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(70),
        ],
      ],
      files: ['', Validators.required],
    });
  }

  initializeEditForm() {
    this.propertyForm.patchValue({
      title: this.propertyToEdit.title,
      price: this.propertyToEdit.price,
      bedroom: this.propertyToEdit.bedroom,
      capacity: this.propertyToEdit.capacity,
      area: this.propertyToEdit.area,
      description: this.propertyToEdit.description,
      region: this.propertyToEdit.region,
      city: this.propertyToEdit.city,
      postal_code: this.propertyToEdit.postal_code,
      barangay: this.propertyToEdit.barangay,
    });
    this.setImages(this.propertyToEdit.images);
  }

  onSubmit(): void {
    if (!this.propertyForm.valid) return;

    this.submitted = true;
    this.submitButtonDisabled = true;

    window.scrollTo({ top: 0, behavior: 'smooth' });

    const selectedRegion = this.regions.find(
      (r) => r.region_code === this.defaultRegionCode
    )?.region_name;

    const propertyData: Property = {
      ...this.propertyForm.value,
      region: selectedRegion || 'National Capital Region (NCR)',
    };

    const files: File[] = this.images.map((image) => image.file);
    this.addListingService.createProperty(propertyData, files).subscribe(
      (data) => {
        if (data.hasOwnProperty('createdProperty')) {
          this.createdPropertyId = data.createdProperty.id;
          this.submitted = false;
          this.submissionSuccess = true;
          this.images = [];
          this.resetForm();
        }
        this.submitButtonDisabled = false;
      },
      () => {
        this.submitButtonDisabled = false;
      }
    );
  }

  handleUpdate(): void {
    if (!this.validateUpdateForm()) return;

    const newValue = this.propertyForm.value;
    const oldValue = this.propertyToEdit;

    const keysToCompare = [
      'title',
      'price',
      'bedroom',
      'capacity',
      'area',
      'barangay',
      'city',
      'description',
      'postal_code',
    ];

    const propertiesDifferent = this.arePropertiesDifferent(
      newValue,
      oldValue,
      keysToCompare
    );

    const newFiles = Array.from(newValue.files || []) as File[];
    const oldFiles = Array.from(this.initialImages || []) as File[];
    const filesDifferent = this.areFilesDifferent(newFiles, oldFiles);

    if (propertiesDifferent || filesDifferent) {
      this.submitted = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.submitButtonDisabled = true;

      this.addListingService
        .updateProperty(oldValue.id, newValue, newFiles)
        .subscribe({
          next: (data) => {
            console.log(data);
            if (data.hasOwnProperty('updatedProperty')) {
              this.createdPropertyId = oldValue.id;
              this.submitted = false;
              this.submissionSuccess = true;
              this.images = [];
              this.resetForm();
            }
          },
        });
    }
  }

  areFilesDifferent(newFiles: File[], oldFiles: File[]): boolean {
    if (newFiles.length !== oldFiles.length) {
      return true;
    }

    for (let i = 0; i < newFiles.length; i++) {
      const newFile = newFiles[i];
      const oldFile = oldFiles[i];
      if (
        newFile.name !== oldFile.name ||
        newFile.size !== oldFile.size ||
        newFile.type !== oldFile.type ||
        newFile.lastModified !== oldFile.lastModified
      ) {
        return true;
      }
    }

    return false;
  }

  arePropertiesDifferent(
    newValue: any,
    oldValue: any,
    keysToCompare: string[]
  ): boolean {
    return keysToCompare.some((key) => newValue[key] !== oldValue[key]);
  }

  loadPropertyToEdit(): void {
    if (!this.isEditing) return;

    this.propertyService.getProperty(this.idToEdit).subscribe({
      next: (response) => {
        this.propertyToEdit = response;
        this.initializeEditForm();
      },
      error: (err) => {
        //handle error pls
      },
    });
  }

  resetForm(): void {
    this.propertyForm.reset({
      title: '',
      price: '',
      bedroom: '',
      capacity: '',
      area: '',
      description: '',
      region: this.defaultRegionCode,
      city: '',
      postal_code: '',
      barangay: '',
      files: '',
    });

    this.propertyForm.markAsPristine();
    this.propertyForm.markAsUntouched();
    this.propertyForm.updateValueAndValidity();

    this.images = [];
    this.fileInput.nativeElement.value = '';

    Object.keys(this.propertyForm.controls).forEach((key) => {
      const control = this.propertyForm.get(key);
      control!.updateValueAndValidity();
    });
  }

  validateUpdateForm(): boolean {
    if(!this.propertyForm.touched) return false;
    if(this.propertyForm.pristine) return false;
    if(!this.propertyForm.valid) return false;

    const file = this.fileInput.nativeElement.files;
    if (file.length === 0) return false;

    return true;
  }

  priceValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value;
    if (isNaN(value) || value < 0.01 || value > 10000000) {
      return { priceInvalid: true };
    }
    return null;
  }

  loadCitiesByRegion(regionCode: string): void {
    this.locationService.getCities().subscribe((data: City[]) => {
      this.cities = data.filter((entry: City) =>
        entry.province_code.startsWith(regionCode)
      );
    });
  }

  onFileChange(): void {
    const inputElement = this.fileInput.nativeElement;

    if (inputElement.files && inputElement.files.length > 0) {
      const files = Array.from(inputElement.files) as File[];
      this.handleFiles(files);
    }
  }

  handleFiles(files: File[]): void {
    const validFileTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/svg+xml',
    ];
    const validFiles: File[] = [];
    const invalidFiles: File[] = [];

    files.forEach((file) => {
      if (validFileTypes.includes(file.type)) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file);
      }
    });

    // Check if any files are invalid
    if (invalidFiles.length > 0) {
      this.fileError =
        'Some files have invalid formats. Only JPEG, PNG, GIF, and SVG formats are allowed.';
    } else {
      this.fileError = null;
    }

    // Check if exceeding maximum number of images
    if (validFiles.length + this.images.length > this.maxImages) {
      this.imageLimitExceeded = true;
    } else {
      this.imageLimitExceeded = false;
      this.images = [
        ...this.images,
        ...validFiles.map((file) => ({
          file,
          preview: URL.createObjectURL(file),
        })),
      ];

      this.propertyForm.patchValue({
        files: this.images.map((image) => image.file),
      });
      this.propertyForm.get('files')!.updateValueAndValidity();
    }
  }

  setImages(images: { image_url: string }[]): void {
    const dataTransfer = new DataTransfer();

    const imageObservables: Observable<File>[] = images.map((image) =>
      this.addListingService
        .getImages(image.image_url)
        .pipe(map((file) => file as File))
    );

    forkJoin(imageObservables).subscribe({
      next: (files: File[]) => {
        files.forEach((file) => {
          dataTransfer.items.add(file);
        });

        this.fileInput.nativeElement.files = dataTransfer.files;
        this.initialImages = dataTransfer.files;

        const event = new Event('change', { bubbles: true });
        this.fileInput.nativeElement.dispatchEvent(event);
      },
    });
  }

  removeImage(index: number): void {
    this.images.splice(index, 1);
    this.propertyForm.patchValue({
      files: this.images.map((image) => image.file),
    });
    this.propertyForm.get('files')!.updateValueAndValidity();
    this.resetFileInput();
  }

  resetFileInput(): void {
    this.fileInput.nativeElement.value = '';
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const files = Array.from(event.dataTransfer.files) as File[];
      this.handleFiles(files);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  //#region getter functions
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
  //#endregion
}
