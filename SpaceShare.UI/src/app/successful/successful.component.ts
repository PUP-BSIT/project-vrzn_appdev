import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-successful',
  templateUrl: './successful.component.html',
  styleUrl: './successful.component.css',
})
export class SuccessfulComponent implements AfterViewInit {
  @Input() createdPropery!: number;
  @Input() mainMessage!: string;
  @Input() subMessage!: string;
  @ViewChild('SuccessModal') success!: ElementRef;

  ngAfterViewInit() {
    this.openModal();
  }

  openModal() {
    const modal = this.success.nativeElement as HTMLDialogElement;
    modal.showModal();
  }

  closeModal() {
    const modal = this.success.nativeElement as HTMLDialogElement;
    modal.close();
  }
}
