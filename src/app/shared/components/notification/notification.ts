import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type NotificationType = 'success' | 'info' | 'error';

@Component({
  standalone: true,
  selector: 'app-notification',
  imports: [CommonModule],
  template: `
  <div *ngIf="message" [ngClass]="containerClass">
    {{ message }}
  </div>
  `
})
export class NotificationComponent {
  @Input() message = '';
  @Input() type: NotificationType = 'success';

  get containerClass(): string {
    switch (this.type) {
      case 'error':
        return 'rounded-lg bg-red-50 text-red-800 text-sm px-3 py-2 border border-red-200';
      case 'info':
        return 'rounded-lg bg-blue-50 text-blue-800 text-sm px-3 py-2 border border-blue-200';
      default:
        return 'rounded-lg bg-green-50 text-green-800 text-sm px-3 py-2 border border-green-200';
    }
  }
}
