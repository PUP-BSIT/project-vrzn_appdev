import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/appsettings';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'], 
})
export class AppComponent {

  title = 'SpaceShare.UI';
  showModal: boolean = false;
  phoneNumber!: string;

  closeModal() {
    this.showModal = false;
  }

}
