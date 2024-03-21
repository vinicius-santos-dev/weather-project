export interface ForecastCity {
  id: number,
  name: string,
  coord: {
    lat: number,
    lon: number
  },
  country: string,
  population: number,
  timezone: number,
  sunrise: number,
  sunset: number
}