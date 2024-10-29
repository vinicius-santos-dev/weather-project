import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Forecast, SimpleForecast, Temps } from '../../models';
import { GeneralInfo } from '../../models/general-info.model';
import { TemperatureUnitService } from '../../services/temperature-unit.service';
import { UnsubscribeMixin } from '../../mixins';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-forecast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './forecast.component.html',
  styleUrl: './forecast.component.scss',
})
export class ForecastComponent
  extends UnsubscribeMixin
  implements OnInit, OnChanges
{
  @Input() public forecast: Forecast = {} as Forecast;

  public now = new Date();
  public filteredForecastList: GeneralInfo[] = [];
  public simpleForecasts: SimpleForecast[] = [];

  constructor(private temperatureUnitService: TemperatureUnitService) {
    super();
  }

  get currentUnit(): 'C' | 'F' {
    return this.temperatureUnitService.getTemperatureUnit();
  }

  ngOnInit(): void {
    this.temperatureUnitService.temperatureUnit$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.getMaxAndMinTemp(this.filteredForecastList);
      });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['forecast'] && changes['forecast'].currentValue) {
      this.filterForecastList(this.forecast.list);
      this.getMaxAndMinTemp(this.filteredForecastList);
    }
  }

  public filterForecastList(forecastList: GeneralInfo[]): void {
    const currentDay = this.formatDate(this.now);

    this.filteredForecastList = forecastList?.filter((forecast) => {
      const forecastDate = new Date(forecast.dt_txt);
      const forecastDay = this.formatDate(forecastDate);
      const forecastHour = this.formatHour(forecastDate);

      return forecastDay !== currentDay && forecastHour !== '00';
    });
  }

  public getMaxAndMinTemp(forecastList: GeneralInfo[]): void {
    const maxTemps = this.calculateTemps(forecastList, 'max');
    const minTemps = this.calculateTemps(forecastList, 'min');

    // console.log('MAX TEMPS: ', maxTemps);
    // console.log('MIN TEMPS: ', minTemps);

    this.setSimpleForecasts(maxTemps, minTemps);

    // console.log(this.simpleForecasts);
  }

  public setSimpleForecasts(maxTemps: Temps, minTemps: Temps): void {
    this.simpleForecasts = Object.keys(maxTemps).map((date) => {
      let { temp: maxTemp, icon } = maxTemps[date];
      let { temp: minTemp } = minTemps[date];

      icon = icon.includes('n') ? icon.replace('n', 'd') : icon;

      return {
        icon,
        maxTemp,
        minTemp,
        date,
      };
    });
  }

  private calculateTemps(
    forecastList: GeneralInfo[],
    type: 'max' | 'min'
  ): Temps {
    return forecastList?.reduce<Temps>((temps, forecast) => {
      const forecastDate = this.formatForecastDate(new Date(forecast.dt_txt));
      const temp = this.convertKelvinToUnit(
        type === 'max' ? forecast.main.temp_max : forecast.main.temp_min
      );

      const infos = {
        icon: forecast.weather[0]?.icon,
        date: forecastDate,
        temp,
      };

      // console.log('SIMPLE FORECASTS', this.simpleForecasts);
      if (
        !temps[forecastDate] ||
        (type === 'max'
          ? temp > temps[forecastDate]?.temp
          : temp < temps[forecastDate]?.temp)
      ) {
        temps[forecastDate] = infos;
      }

      return temps;
    }, {});
  }

  private formatDate(date: Date): string {
    return date.getDate().toString().padStart(2, '0');
  }

  private formatHour(date: Date): string {
    return date.getHours().toString().padStart(2, '0');
  }

  private formatForecastDate(date: Date): string {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const day = days[date.getDay()];
    const month = date.toLocaleString('en-us', { month: 'short' });
    const formattedDate = this.formatDate(date);

    return `${formattedDate} ${month}, ${day}`;
  }

  private convertKelvinToCelsius(kelvin: number): number {
    return Math.round(kelvin - 273.15);
  }

  private convertKelvinToFahrenheit(kelvin: number): number {
    return Math.round((kelvin - 273.15) * (9 / 5) + 32);
  }

  private convertKelvinToUnit(kelvin: number): number {
    return this.currentUnit === 'C'
      ? this.convertKelvinToCelsius(kelvin)
      : this.convertKelvinToFahrenheit(kelvin);
  }
}
