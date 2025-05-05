import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, RouterModule]
})
export class SettingsPage implements OnInit {
  pomodoroMinutes: number = 25;
  breakMinutes: number = 5;

  constructor(private toastCtrl: ToastController) {}

  async ngOnInit() {
    const pomodoro = await Preferences.get({ key: 'pomodoroMinutes' });
    const breakTime = await Preferences.get({ key: 'breakMinutes' });

    this.pomodoroMinutes = pomodoro.value ? +pomodoro.value : 25;
    this.breakMinutes = breakTime.value ? +breakTime.value : 5;
  }

  async saveSettings() {
    await Preferences.set({ key: 'pomodoroMinutes', value: this.pomodoroMinutes.toString() });
    await Preferences.set({ key: 'breakMinutes', value: this.breakMinutes.toString() });

    const toast = await this.toastCtrl.create({
      message: 'Settings saved!',
      duration: 2000,
      color: 'success',
    });
    await toast.present();
  }
}
