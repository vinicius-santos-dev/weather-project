import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { City, Forecast } from '../models';
import { environment } from '../../environments/environment';

/**
 * Service handling OpenWeather API interactions:
 * - Current weather data
 * - 5-day forecast data
 */
@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private baseUrl = 'https://api.openweathermap.org/data/2.5';
  private apiKey: string = environment.WEATHER_API_KEY;

  constructor(private http: HttpClient) {}

  /**
   * Fetches current weather for given location
   * @param location City name
   * @param options Optional HTTP parameters (e.g. cache busting)
   */
  public getWeather(
    location: string,
    options?: { params: HttpParams }
  ): Observable<City> {
    return this.http
      .get<City>(
        `${this.baseUrl}/weather?q=${location}&appid=${this.apiKey}`,
        options
      )
      .pipe(map((response) => response as City));
  }


  /**
   * Fetches 5-day forecast using city ID
   * @param id City ID from weather response
   * @param options Optional HTTP parameters
   */
  public getForecast(
    id: number,
    options?: { params: HttpParams }
  ): Observable<Forecast> {
    return this.http
      .get<Forecast>(
        `${this.baseUrl}/forecast?id=${id}&appid=${this.apiKey}`,
        options
      )
      .pipe(map((response) => response as Forecast));
  }
}
