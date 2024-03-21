import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { City, Forecast } from '../models';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private baseUrl = 'https://api.openweathermap.org/data/2.5';
  private apiKey = environment.WEATHER_API_KEY;

  constructor(private http: HttpClient) {}

  public getWeather(location: string): Observable<City> {
    return this.http
      .get<City>(
        `${this.baseUrl}/weather?q=${location}&appid=${this.apiKey}`,
        {}
      )
      .pipe(map((response) => response as City));
  }

  public getForecast(id: number): Observable<Forecast> {
    return this.http
      .get<Forecast>(
        `${this.baseUrl}/forecast?id=${id}&appid=${this.apiKey}`,
        {}
      )
      .pipe(map((response) => response as Forecast));
  }
}