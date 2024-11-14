import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Service for managing temperature unit preferences (Celsius/Fahrenheit)
 * Provides global state and conversions between units
 */
@Injectable({
  providedIn: 'root',
})
export class TemperatureUnitService {
  private _temperatureUnit = new BehaviorSubject<'C' | 'F'>('C');
  temperatureUnit$ = this._temperatureUnit.asObservable();

  private isLocalStorageDefined = typeof localStorage !== 'undefined';

  constructor() {
    if (!this.isLocalStorageDefined) return;

    const storedUnit = localStorage.getItem('temperatureUnit') as 'C' | 'F';

    if (storedUnit) {
      this._temperatureUnit.next(storedUnit);
    }
  }

  getTemperatureUnit(): 'C' | 'F' {
    return this._temperatureUnit.getValue();
  }

  setTemperatureUnit(unit: 'C' | 'F') {
    this._temperatureUnit.next(unit);
    localStorage.setItem('temperatureUnit', unit);
  }
}
