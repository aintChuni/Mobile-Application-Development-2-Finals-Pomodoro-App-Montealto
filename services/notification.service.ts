import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor() {
    this.requestPermission();
  }

  async requestPermission() {
    const result = await LocalNotifications.requestPermissions();
    console.log('Notification permission:', result);
  }

  async sendNotification(title: string, body: string) {
    await LocalNotifications.schedule({
      notifications: [
        {
          title,
          body,
          id: Math.floor(Math.random() * 10000),
          schedule: { at: new Date(Date.now() + 1000) }, // slight delay
          sound: " ",
        },
      ],
    });
  }
}
