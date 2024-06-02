import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';
import { TestModel } from '../../model/TestModel';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  constructor(private appService: AppService){}

  ngOnInit() {
    this.appService.getTestApi().subscribe((data: TestModel) => {
      console.log(data);
    })
  }
}
