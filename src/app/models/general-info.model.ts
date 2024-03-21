import { Clouds } from "./clouds.model"
import { Main } from "./main.model"
import { Sys } from "./sys.model"
import { Weather } from "./weather.model"
import { Wind } from "./wind.model"

export interface GeneralInfo {
  dt: number,
  main: Main,
  weather: Weather[],
  clouds: Clouds,
  wind: Wind,
  sys: Sys,
  dt_txt: string
}