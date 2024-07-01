import { Component, Input, OnInit } from '@angular/core';
import { Application } from '../../../model/application.model';
import { PropertyService } from '../../property/property.service';
import { Property } from '../../../model/property.model';
import { User } from '../../../model/user.model';
import { AuthService } from '../../auth/auth.service';
import { ProfileService } from '../../profile/profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-application-card',
  templateUrl: './application-card.component.html',
  styleUrl: './application-card.component.css'
})
export class ApplicationCardComponent implements OnInit {
  @Input() application!: Application;
  property!: Property;
  applicant!: User;

  constructor(private propertyService: PropertyService, 
    private authService: ProfileService, private router: Router){}

  ngOnInit(): void {
      this.propertyService.getProperty(this.application.property_id).subscribe({
        next: (data: Property) => {
          this.property = data;
        }
      })
      this.authService.getUserProfile(this.application.applicant_id).subscribe({
        next: (data: User) => {
          this.applicant = data;
        }
      })
  }

  handleAccept(id: number){
    console.log(id);
  }

  handleReject(id: number){
    console.log(id);
  }
}
