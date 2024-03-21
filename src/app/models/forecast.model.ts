import { ForecastCity } from "./forecast-city.model";
import { GeneralInfo } from "./general-info.model";


export interface Forecast {
  cod: string,
  message: number,
  cnt: number,
  list: GeneralInfo[],
  city: ForecastCity,
}