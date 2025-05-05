import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { NotificationService } from 'services/notification.service';
import { VibrationService } from 'services/vibration.service';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule]
})
export class HomePage implements OnInit, OnDestroy {
  currentTime: string = '';
  countdownTime: string = '';
  isRunning: boolean = false;
  isBreak: boolean = false;
  progress: number = 0;

  private timerSubscription: Subscription | undefined;
  private totalSeconds: number = 0;

  constructor(
    private notificationService: NotificationService,
    private vibrationService: VibrationService
  ) {}

  ngOnInit() {
    this.updateClock();
    setInterval(() => this.updateClock(), 1000);
  }

  updateClock() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString();
  }

  async startPomodoro() {
    this.isRunning = true;
    this.isBreak = false;

    const stored = await Preferences.get({ key: 'pomodoroMinutes' });
    const minutes = stored.value ? +stored.value : 25;

    this.startTimer(minutes * 60);
  }

  async startBreak() {
    this.isBreak = true;

    const stored = await Preferences.get({ key: 'breakMinutes' });
    const minutes = stored.value ? +stored.value : 5;

    this.startTimer(minutes * 60);
  }

  startTimer(duration: number) {
    this.totalSeconds = duration;
    const initialSeconds = duration;
    this.updateCountdown();

    this.timerSubscription = interval(1000).subscribe(() => {
      this.totalSeconds--;
      this.updateCountdown();
      this.progress = 1 - this.totalSeconds / initialSeconds;

      if (this.totalSeconds <= 0) {
        this.timerSubscription?.unsubscribe();
        this.vibrationService.vibrate();

        if (!this.isBreak) {
          this.notificationService.sendNotification("Pomodoro finished!", "Time for a break.");
          this.startBreak();
        } else {
          this.notificationService.sendNotification("Break finished!", "Time to focus again.");
          this.resetState();
        }
      }
    });
  }

  updateCountdown() {
    const minutes = Math.floor(this.totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (this.totalSeconds % 60).toString().padStart(2, '0');
    this.countdownTime = `${minutes}:${seconds}`;
  }

  resetState() {
    this.isRunning = false;
    this.isBreak = false;
    this.countdownTime = '';
    this.progress = 0;
  }

  resetPomodoro() {
    this.timerSubscription?.unsubscribe();
    this.resetState();
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
  }
}
