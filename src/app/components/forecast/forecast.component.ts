import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Forecast, SimpleForecast } from '../../models';
import { GeneralInfo } from '../../models/general-info.model';

@Component({
  selector: 'app-forecast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './forecast.component.html',
  styleUrl: './forecast.component.scss',
})
export class ForecastComponent implements OnChanges {
  @Input() public forecast: Forecast = {} as Forecast;

  public now = new Date();
  public filteredForecastList: GeneralInfo[] = [];
  public firstItemsOfEachDay: GeneralInfo[] = [];
  public simpleForecasts: SimpleForecast[] = [];

  constructor() {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['forecast'] && changes['forecast'].currentValue) {
      this.filterForecastList(this.forecast.list);
      this.getFirstItemOfEachDay(this.filteredForecastList);
      this.setSimpleForecasts(this.firstItemsOfEachDay);
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

  public getFirstItemOfEachDay(forecastList: GeneralInfo[]): void {
    this.firstItemsOfEachDay = forecastList?.reduce(
      (firstItems: GeneralInfo[], currentForecast, index) => {
        const previousForecastDate =
          index > 0 ? new Date(forecastList[index - 1].dt_txt) : null;
        const currentForecastDate = new Date(currentForecast.dt_txt);

        if (
          index === 0 ||
          (previousForecastDate &&
            this.formatDate(previousForecastDate) !==
              this.formatDate(currentForecastDate))
        ) {
          firstItems.push(currentForecast);
        }

        return firstItems;
      },
      []
    );

    // console.log('FIRST ITEMS OF EACH DAY', this.firstItemsOfEachDay);
  }

  public setSimpleForecasts(forecastList: GeneralInfo[]): void {
    this.simpleForecasts = forecastList?.map((forecast) => {
      const icon = forecast.weather[0].icon;
      const date = this.formatForecastDate(new Date(forecast.dt_txt));
      const maxTemp = this.convertKelvinToCelsius(forecast.main.temp_max);
      const minTemp = this.convertKelvinToCelsius(forecast.main.temp_min);

      return {
        icon,
        maxTemp,
        minTemp,
        date,
      };
    });

    // console.log('SIMPLE FORECASTS', this.simpleForecasts);
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
}
