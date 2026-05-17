import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { NavBarComponent } from './shared/components/nav-bar/nav-bar';

const PUBLIC_ROUTES = ['/login', '/acesso', '/boas-vindas'];

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterModule, RouterOutlet, CommonModule, NavBarComponent],
  template: `
    <router-outlet></router-outlet>
    <app-nav-bar *ngIf="showNav"></app-nav-bar>
  `
})
export class AppComponent implements OnInit {
  showNav = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.showNav = !PUBLIC_ROUTES.some(r => e.urlAfterRedirects.startsWith(r));
      });
  }
}
