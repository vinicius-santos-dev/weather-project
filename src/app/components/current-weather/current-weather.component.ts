import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { City } from '../../models';
import { TemperatureUnitComponent } from '../temperature-unit/temperature-unit.component';
import { UnsubscribeMixin } from '../../mixins';
import { TemperatureUnitService } from '../../services/temperature-unit.service';
import { takeUntil } from 'rxjs';

/**
 * Displays current weather information and handles temperature unit conversions
 */
@Component({
  selector: 'app-current-weather',
  standalone: true,
  imports: [CommonModule, TemperatureUnitComponent],
  templateUrl: './current-weather.component.html',
  styleUrl: './current-weather.component.scss',
})
export class CurrentWeatherComponent
  extends UnsubscribeMixin
  implements OnInit, OnChanges
{
  @Input() public city: City = {} as City;
  @Output() public weatherChange = new EventEmitter<string>();

  public temperatures = {
    currentTemp: 0,
    minTemp: 0,
    maxTemp: 0,
    feelsLike: 0,
  };

  public weather = '';

  constructor(private temperatureUnitService: TemperatureUnitService) {
    super();
  }

  get currentUnit(): 'C' | 'F' {
    return this.temperatureUnitService.getTemperatureUnit();
  }

  public ngOnInit(): void {
    this.temperatureUnitService.temperatureUnit$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.temperatures = {
          currentTemp: this.convertKelvinToUnit(this.city.main.temp),
          minTemp: this.convertKelvinToUnit(this.city.main.temp_min),
          maxTemp: this.convertKelvinToUnit(this.city.main.temp_max),
          feelsLike: this.convertKelvinToUnit(this.city.main.feels_like),
        };
      });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (!this.city.main) return;

    if (changes['city'] && changes['city'].currentValue) {
      this.temperatures = {
        currentTemp: this.convertKelvinToUnit(this.city.main.temp),
        minTemp: this.convertKelvinToUnit(this.city.main.temp_min),
        maxTemp: this.convertKelvinToUnit(this.city.main.temp_max),
        feelsLike: this.convertKelvinToUnit(this.city.main.feels_like),
      };

      this.weather = this.city.weather[0].main.toLocaleLowerCase();
      this.onWeatherChange(this.weather);
    }
  }

  public onWeatherChange(weather: string): void {
    this.weatherChange.emit(weather);
  }

  private convertKelvinToCelsius(kelvin: number): number {
    return Math.round(kelvin - 273.15);
  }

  private convertKelvinToFahrenheit(kelvin: number): number {
    return Math.round((kelvin - 273.15) * 1.8 + 32);
  }

  private convertKelvinToUnit(kelvin: number): number {
    return this.currentUnit === 'C'
      ? this.convertKelvinToCelsius(kelvin)
      : this.convertKelvinToFahrenheit(kelvin);
  }
}
