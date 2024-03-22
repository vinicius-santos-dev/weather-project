import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-temperature-unit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './temperature-unit.component.html',
  styleUrl: './temperature-unit.component.scss',
})
export class TemperatureUnitComponent {
  public temperatureUnits = [
    { name: 'Celsius', unit: 'C' },
    { name: 'Fahrenheit', unit: 'F' },
  ];

  public currentUnit = 'C';

  constructor() {}

  public changeTemperatureUnit(unit: string): void {
    if (unit === this.currentUnit) return;

    this.currentUnit = unit;
  }
}
