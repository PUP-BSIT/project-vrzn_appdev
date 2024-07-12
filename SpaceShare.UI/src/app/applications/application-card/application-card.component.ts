import { Component, Input, OnInit } from '@angular/core';
import { Application } from '../../../model/application.model';
import { PropertyService } from '../../property/property.service';
import { Property } from '../../../model/property.model';
import { User } from '../../../model/user.model';
import { AuthService } from '../../auth/auth.service';
import { ProfileService } from '../../profile/profile.service';
import { Router } from '@angular/router';
import { ApplicationsService } from '../applications.service';

@Component({
  selector: 'app-application-card',
  templateUrl: './application-card.component.html',
  styleUrl: './application-card.component.css'
})
export class ApplicationCardComponent implements OnInit {
  @Input() application!: Application;
  property!: Property;
  applicant!: User;
  submitted!: boolean;
  success!: boolean;
  error!: boolean;

  constructor(private propertyService: PropertyService, 
    private authService: ProfileService, private applicationService: ApplicationsService){}

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

  handleAccept(){
    this.submitted = true

    if(!this.application) {
      this.submitted = false;
      this.error = true;
    }

    this.applicationService.handleAcceptApplication(this.application).subscribe({
      next: data => {
        this.submitted = false;
        this.success = true;
      },
      error: () => {
        this.submitted = false;
        this.error = true;
      }
    })

  }

  handleReject(){
    this.submitted = true;

    if (!this.application) {
      this.submitted = false;
      this.error = true;
    }

    this.applicationService
      .handleRejectApplication(this.application)
      .subscribe({
        next: (data : { success: boolean}) => {
          if(data.success) {
            this.submitted = false;
            this.success = true;
          }
        },
        error: () => {
          this.submitted = false;
          this.error = true;
        },
    });
  }
}
