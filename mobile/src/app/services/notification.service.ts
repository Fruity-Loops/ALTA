import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject(null);
  currentNotificationData = this.notifications.asObservable();

  constructor() { }

  notify(data) {
    this.notifications.next(data);
  }
}
