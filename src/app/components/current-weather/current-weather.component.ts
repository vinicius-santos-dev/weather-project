import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { City } from '../../models';
import { TemperatureUnitComponent } from '../temperature-unit/temperature-unit.component';

@Component({
  selector: 'app-current-weather',
  standalone: true,
  imports: [CommonModule, TemperatureUnitComponent],
  templateUrl: './current-weather.component.html',
  styleUrl: './current-weather.component.scss',
})
export class CurrentWeatherComponent implements OnChanges {
  @Input() public city: City = {} as City;
  @Output() public weatherChange = new EventEmitter<string>();

  public temperatures = {
    currentTemp: 0,
    minTemp: 0,
    maxTemp: 0,
    feelsLike: 0,
  };

  public weather = '';

  constructor() {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (!this.city.main) return;

    if (changes['city'] && changes['city'].currentValue) {
      this.temperatures = {
        currentTemp: this.convertKelvinToCelsius(this.city.main.temp),
        minTemp: this.convertKelvinToCelsius(this.city.main.temp_min),
        maxTemp: this.convertKelvinToCelsius(this.city.main.temp_max),
        feelsLike: this.convertKelvinToCelsius(this.city.main.feels_like),
      };

      this.weather = this.city.weather[0].main.toLocaleLowerCase();
      this.onWeatherChange(this.weather);
    }
  }

  public convertKelvinToCelsius(kelvin: number): number {
    return Math.round(kelvin - 273.15);
  }

  public onWeatherChange(weather: string): void {
    this.weatherChange.emit(weather);
  }
}
