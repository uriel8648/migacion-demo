import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  /**
   * Base URL for the application
   * Equivalent to the JSP <c:url> tag functionality
   */
  baseUrl: string = '';
  navCollapsed = false;
  /**
   * Controls the collapsed state of the navbar in mobile views
   */
  isNavbarCollapsed = new BehaviorSubject<boolean>(true);
  isNavbarCollapsed$ = this.isNavbarCollapsed.asObservable();

  /**
   * Constructor with dependency injection
   * @param router Angular Router service for navigation
   */
  constructor(private router: Router) { }

  /**
   * Initialize component
   * Sets up any initial state needed for the header
   */
  ngOnInit(): void {
    // In Angular, we don't need to manually set the base URL as we did with JSP
    // The router handles URL construction based on the defined routes
    // This is left here for potential customization if needed
  }

  /**
   * Navigate to a specific route
   * @param route The route to navigate to
   */
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  /**
   * Toggle the navbar collapse on mobile views
   * This would be connected to the template via event binding
   */
  toggleNavbar(): void {
    this.isNavbarCollapsed.next(!this.isNavbarCollapsed.value);
   
  }

  /**
   * Check if the current route is active
   * @param route The route to check
   * @returns boolean indicating if the route is currently active
   */
  isRouteActive(route: string): boolean {
    return this.router.url === route || this.router.url.startsWith(route);
  }

  isNavCollapsed(): boolean {
    return this.navCollapsed;
  }
  toggleNav(): void {
    this.navCollapsed = !this.navCollapsed;
  }
}