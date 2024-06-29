import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrl: '../agreement.component.css'
})
export class TermsComponent implements OnInit {
  
  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

}
