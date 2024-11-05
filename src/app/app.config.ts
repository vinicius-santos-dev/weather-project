import { APP_INITIALIZER, ApplicationConfig, Injectable } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class AppConfig {
  private _config: any;

  loadConfig() {
    this._config = {
      apiKey: environment.WEATHER_API_KEY
    };
    // apiKey: process.env['NG_APP_API_KEY'] || 'default_value'
    return Promise.resolve();
  }

  get config() {
    return this._config;
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimations(),
    provideHttpClient(withFetch()),
    {
      provide: APP_INITIALIZER,
      useFactory: (config: AppConfig) => () => config.loadConfig(),
      deps: [AppConfig],
      multi: true
    }
  ],
};
