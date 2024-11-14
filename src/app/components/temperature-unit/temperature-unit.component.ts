import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TemperatureUnitService } from '../../services/temperature-unit.service';
import { UnsubscribeMixin } from '../../mixins';

/**
 * Component for managing temperature unit selection (Celsius/Fahrenheit)
 */
@Component({
  selector: 'app-temperature-unit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './temperature-unit.component.html',
  styleUrl: './temperature-unit.component.scss',
})
export class TemperatureUnitComponent
  extends UnsubscribeMixin
{
  public temperatureUnits = [
    { name: 'Celsius', unit: 'C' },
    { name: 'Fahrenheit', unit: 'F' },
  ];

  constructor(private temperatureUnitService: TemperatureUnitService) {
    super();
  }

  get currentUnit(): 'C' | 'F' {
    return this.temperatureUnitService.getTemperatureUnit();
  }

  public changeTemperatureUnit(unit: string): void {
    if (unit === this.temperatureUnitService.getTemperatureUnit()) return;

    this.temperatureUnitService.setTemperatureUnit(unit as 'C' | 'F');
  }
}
