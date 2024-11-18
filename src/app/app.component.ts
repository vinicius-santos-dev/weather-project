import { ChangeDetectorRef, Component } from '@angular/core';
import { WeatherComponent } from './components';

/**
 * Root component that handles app-wide background changes based on weather
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [WeatherComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  public backgroundImage = 'url(../assets/images/backgrounds/clear.webp)';

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  // Updates background image when weather changes and forces view refresh
  public onWeatherChange(weather: string): void {
    this.backgroundImage = `url(../assets/images/backgrounds/${weather}.webp)`;
    this.changeDetectorRef.detectChanges();
  }
}
