import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'], // Change "styleUrl" to "styleUrls"
})
export class AppComponent implements OnInit{
  // Implement OnInit interface
  title = 'SpaceShare.UI';
  showModal: boolean = false;
  phoneNumber!: string;
  hideHeaderFooter = false

  constructor(private router: Router){}

  ngOnInit(): void {
    this.router.events
    .subscribe({
      next: data => {
        if(data instanceof NavigationEnd){
          const excludedRoutes = ['unauthorized', 'went-wrong']
          this.hideHeaderFooter = excludedRoutes.some(route => this.router.url.includes(route));          
        }
      }
    })
  }

  closeModal() {
    this.showModal = false;
  }

}
