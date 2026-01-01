import { Component, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterModule, RouterOutlet],
  template: `<router-outlet></router-outlet>`
})
export class AppComponent {}
