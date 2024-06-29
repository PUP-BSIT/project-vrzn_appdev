import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-wait',
  templateUrl: './wait.component.html',
  styleUrl: './wait.component.css',
})
export class WaitComponent {
  @ViewChild('wait') wait!: ElementRef;

  ngAfterViewInit() {
    this.openModal();
  }

  openModal() {
    const modal = this.wait.nativeElement as HTMLDialogElement;
    modal.showModal();
  }

  closeModal() {
    const modal = this.wait.nativeElement as HTMLDialogElement;
    modal.close();
  }
}
