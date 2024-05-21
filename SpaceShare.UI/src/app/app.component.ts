import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'], // Change "styleUrl" to "styleUrls"
})
export class AppComponent implements OnInit {
  // Implement OnInit interface
  title = 'SpaceShare.UI';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Implement ngOnInit method
    this.http.get<any>('http://localhost:3000/api').subscribe((data) => {
      console.log(data);
      return data;
    });
  }
}
