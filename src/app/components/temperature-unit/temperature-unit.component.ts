import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TemperatureUnitService } from '../../services/temperature-unit.service';
import { UnsubscribeMixin } from '../../mixins';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-temperature-unit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './temperature-unit.component.html',
  styleUrl: './temperature-unit.component.scss',
})
export class TemperatureUnitComponent
  extends UnsubscribeMixin
  // implements OnInit
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

  // ngOnInit(): void {
  //   this.temperatureUnitService.temperatureUnit$
  //     .pipe(takeUntil(this.unsubscribe$))
  //     .subscribe((unit) => {
  //       console.log('temperatureUnit', unit);
  //     });
  // }

  public changeTemperatureUnit(unit: string): void {
    if (unit === this.temperatureUnitService.getTemperatureUnit()) return;

    this.temperatureUnitService.setTemperatureUnit(unit as 'C' | 'F');
  }
}
