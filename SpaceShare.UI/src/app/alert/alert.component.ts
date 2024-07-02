import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { AlertService } from './alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css',
})
export class AlertComponent implements AfterViewInit {
  @Input() createdPropery!: number;
  @Input() mainMessage!: string;
  @Input() subMessage!: string;
  @Input() state!: string;
  @ViewChild('SuccessModal') success!: ElementRef;

  constructor(private alertService: AlertService){}

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

  isShownMethod() {
    this.alertService.setUpdateInvalid(false);
    if(this.state === "error") { location.reload(); }
    this.closeModal();
  }
}
