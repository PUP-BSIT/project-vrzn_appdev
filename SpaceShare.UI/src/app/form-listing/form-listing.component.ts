import { Component, OnInit, ViewChild, ElementRef, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddListingService } from './add-listing.service';
import { Property } from '../../model/property.model';
import { LocationService } from '../landing/register/location.service';
import { Region, City } from '../../model/location.model';
import { ActivatedRoute } from '@angular/router';
import { PropertyService } from '../property/property.service';
import { forkJoin, map, Observable, Subject, takeUntil } from 'rxjs';
import { AlertService } from '../alert/alert.service';

@Component({
  selector: 'app-form-listing',
  templateUrl: './form-listing.component.html',
  styleUrls: ['./form-listing.component.css'],
})
export class FormListingComponent implements OnInit {
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
  isLoading = true;
  isInitializing = true;

  defaultRegionCode = '13';
  selectedProvince = '';

  title = 'Add New Space';
  isEditing = false;
  idToEdit!: number;
  propertyToEdit!: Property;
  initialImages!: FileList;
  isUpdateInvalid!: boolean;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private addListingService: AddListingService,
    private locationService: LocationService,
    private route: ActivatedRoute,
    private propertyService: PropertyService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadCitiesByRegion(this.defaultRegionCode);
    this.route.paramMap.subscribe((params) => {
      if (+params.get('id')!) {
        this.title = 'Edit Space';
        this.idToEdit = +params.get('id')!;
        this.isEditing = true;
        this.loadPropertyToEdit();
      }
    });

    this.alertService.updateInvalid$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value) => {
        this.isUpdateInvalid = value;
      });
  }

  initializeForm(): void {
    this.propertyForm = this.formBuilder.group({
      status: [true],
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
      status: !this.propertyToEdit.status,
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
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (!this.validateUpdateForm()) {
      this.isUpdateInvalid = true;
      return;
    }

    if (this.isUpdateInvalid) this.isUpdateInvalid = false;

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

    if (
      propertiesDifferent ||
      filesDifferent ||
      newValue.status !== oldValue.status
    ) {
      this.submitted = true;
      this.submitButtonDisabled = true;
      this.addListingService
        .updateProperty(oldValue.id, newValue, newFiles)
        .subscribe({
          next: (data) => {
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
    newValue: Property,
    oldValue: Property,
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
      error: () => {
        location.href = '/went-wrong';
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
    if (
      !this.propertyForm.touched ||
      this.propertyForm.pristine ||
      !this.propertyForm.valid
    )
      return false;

    return this.images.length > 0;
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
      const excludedCityCodes = [
        '133901',
        '133902',
        '133903',
        '133904',
        '133905',
        '133906',
        '133907',
        '133908',
        '133909',
        '133910',
        '133911',
        '133912',
        '133913',
        '133914',
      ];

      this.cities = data.filter(
        (entry: City) =>
          entry.province_code.startsWith(regionCode) &&
          !excludedCityCodes.includes(entry.city_code)
      );
    });
  }

  onFileChange(): void {
    const inputElement = this.fileInput.nativeElement;

    if (inputElement.files && inputElement.files.length > 0) {
      const files = Array.from(inputElement.files) as File[];
      this.handleFiles(files);

      if (this.isInitializing) return;

      this.propertyForm.get('files')?.markAsTouched();
      this.propertyForm.get('files')?.markAsDirty();
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
    const sizeLimitExceededFiles: File[] = [];
    const MAX_SIZE_MB = 5;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

    files.forEach((file) => {
      if (!validFileTypes.includes(file.type)) {
        invalidFiles.push(file);
      } else if (file.size > MAX_SIZE_BYTES) {
        sizeLimitExceededFiles.push(file);
      } else {
        validFiles.push(file);
      }
    });

    if (invalidFiles.length > 0) {
      this.fileError =
        'Files have invalid formats. Only JPEG, PNG, GIF, and SVG formats are allowed.';
    } else if (sizeLimitExceededFiles.length > 0) {
      this.fileError =
        'File exceed the size limit of 5 MB. Please upload smaller files.';
    } else {
      this.fileError = null;
    }

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
        this.isLoading = false;
        this.isInitializing = false;
      },
    });
  }

  removeImage(index: number, event: Event): void {
    event.stopPropagation();
    event.preventDefault();

    this.images.splice(index, 1);
    this.propertyForm.patchValue({
      files: this.images.map((image) => image.file),
    });

    const filesControl = this.propertyForm.get('files');
    if (filesControl) {
      filesControl.markAsTouched();
      filesControl.markAsDirty();
      filesControl.updateValueAndValidity();
    }

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
