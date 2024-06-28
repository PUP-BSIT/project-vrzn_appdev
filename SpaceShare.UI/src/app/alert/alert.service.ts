import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class AlertService {
  private updateInvalidSubject = new BehaviorSubject<boolean>(false);
  updateInvalid$ = this.updateInvalidSubject.asObservable();

  setUpdateInvalid(value: boolean) {
    this.updateInvalidSubject.next(value);
  }
}
