import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { WeatherService } from '../../services/weather.service';
import { finalize, switchMap, takeUntil } from 'rxjs';
import { UnsubscribeMixin } from '../../mixins';
import { City, Forecast } from '../../models';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-weather-search',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './weather-search.component.html',
  styleUrl: './weather-search.component.scss',
})
export class WeatherSearchComponent extends UnsubscribeMixin implements OnInit {
  @Output() public cityEmitter = new EventEmitter<City>();
  @Output() public forecastEmitter = new EventEmitter<Forecast>();
  @Output() public isLoadingEmitter = new EventEmitter<boolean>();

  public searchForm: FormGroup;
  public isLoading = true;

  constructor(private weatherService: WeatherService) {
    super();

    this.searchForm = new FormGroup({
      location: new FormControl('', Validators.required),
    });
  }

  public ngOnInit() {
    this.getWeather('São Paulo');
  }

  public onSubmit() {
    if (this.searchForm.valid) {
      this.getWeather();
    }
  }

  private getWeather(city?: string) {
    const params = new HttpParams().set('cacheBuster', Date.now().toString());

    const location = (city ? city : this.searchForm.value.location)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    this.isLoading = true;
    this.isLoadingEmitter.emit(this.isLoading);

    this.weatherService
      .getWeather(location, { params })
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap((weatherResponse) => {
          // console.log('WEATHER RESPONSE: ', weatherResponse);

          this.cityEmitter.emit(weatherResponse);

          return this.weatherService.getForecast(weatherResponse.id, {
            params,
          });
        }),
        finalize(() => {
          this.isLoading = false;
          this.isLoadingEmitter.emit(this.isLoading);
        })
      )
      .subscribe({
        next: (forecastResponse) => {
          // console.log('FORECAST RESPONSE: ', forecastResponse);

          this.forecastEmitter.emit(forecastResponse);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
}
