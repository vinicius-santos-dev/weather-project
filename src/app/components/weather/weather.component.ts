import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { WeatherSearchComponent } from '../weather-search/weather-search.component';
import { CurrentWeatherComponent } from '../current-weather/current-weather.component';
import { ForecastComponent } from '../forecast/forecast.component';
import { City, Forecast } from '../../models';

/**
 * Main weather component that orchestrates weather-related child components
 * and handles their communications
 */
@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [
    CommonModule,
    WeatherSearchComponent,
    CurrentWeatherComponent,
    ForecastComponent,
  ],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.scss',
})
export class WeatherComponent {
  public city: City = {} as City;
  public forecast: Forecast = {} as Forecast;
  public isLoading = true;

  @Output() public weatherChange = new EventEmitter<string>();

  constructor() {}

  public handleCityEmitter(city: City) {
    this.city = city;
  }

  public handleWeatherChange(weather: string) {
    this.weatherChange.emit(weather);
  }

  public handleForecastEmitter(forecast: Forecast) {
    this.forecast = forecast;
  }

  public handleIsLoadingEmitter(isLoading: boolean) {
    this.isLoading = isLoading;
  }
}
