import { Component, OnInit } from '@angular/core';
import { ApplicationsService } from './applications.service';
import { Application } from '../../model/application.model';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrl: './applications.component.css',
})
export class ApplicationsComponent implements OnInit {
  applications: Application[] = [];
  loaded = false;

  constructor(private applicationService: ApplicationsService) {}

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    this.applicationService
      .getUserApplications()
      .subscribe((data: Application[]) => {
        this.applications = data;
        this.loaded = true;
      });
  }
}
