import { Component } from '@angular/core';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrl: './applications.component.css'
})
export class ApplicationsComponent {
  wishlistedItem: string[] = [];
  loaded = false; 
}
