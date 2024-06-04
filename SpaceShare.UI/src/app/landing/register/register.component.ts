import { Component, OnInit, ViewChild } from '@angular/core';
import { AgreementComponent } from '../agreement/agreement.component';
import { VerificationComponent } from '../verification/verification.component';
import { LocationService } from './location.service';
import { Region, Province, City, Barangay } from '../../../model/location.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {

  regions: Region[] = [];
  provinces: Province[] = [];
  cities: City[] = [];

  selectedRegion: string = '';
  selectedProvince: string = '';
  selectedCity: string = '';


  @ViewChild(VerificationComponent) verificationComponent!: AgreementComponent;
  showLink = false;

  toggleLinkVisibility() {
    this.showLink = !this.showLink;
  }

  constructor(private locationService: LocationService) {}

  ngOnInit(): void {
    this.loadRegions();
  }

  loadRegions(): void {
    this.locationService.getRegions().subscribe((data: Region[]) => {
      this.regions = data;
    });
  }

  fillProvinces(): void {
    this.locationService.getProvinces().subscribe((data: Province[]) => {
      this.provinces = data.filter((entry: Province) => entry.region_code === this.selectedRegion);
      this.provinces.sort((a, b) => a.province_name.localeCompare(b.province_name));
      this.resetSelections('province');
    });
  }

  fillCities(): void {
    this.locationService.getCities().subscribe((data: City[]) => {
      this.cities = data.filter((entry: City) => entry.province_code === this.selectedProvince);
      this.cities.sort((a, b) => a.city_name.localeCompare(b.city_name));
      this.resetSelections('city');
    });
  }

  resetSelections(level: string): void {
    if (level === 'province') {
      this.selectedProvince = '';
      this.selectedCity = '';
      this.cities = [];
    } else if (level === 'city') {
      this.selectedCity = '';
    } 
  }

  onRegionChange(): void {
    this.fillProvinces();
  }

  onProvinceChange(): void {
    this.fillCities();
  }
   
 
  onCityChange(): void {
   
  }

}
