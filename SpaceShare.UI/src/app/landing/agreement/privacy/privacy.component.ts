import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrl: '../agreement.component.css'
})
export class PrivacyComponent implements OnInit {
  ngOnInit(): void {
      window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
