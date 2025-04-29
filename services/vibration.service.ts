import { Injectable } from '@angular/core';
import { Haptics } from '@capacitor/haptics';

@Injectable({
  providedIn: 'root',
})
export class VibrationService {
  async vibrate() {
    await Haptics.vibrate();
  }
}
