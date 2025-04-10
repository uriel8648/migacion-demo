import { Component, OnInit } from '@angular/core';

/**
 * Footer component
 * 
 * This component displays the application footer with copyright information.
 * Migrated from the original JSP footer.
 */
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  // Current year for dynamic copyright display
  currentYear: number = new Date().getFullYear();
  
  // Application name
  applicationName = 'Todo Application';
  
  constructor() { }

  ngOnInit(): void {
    // Component initialization logic if needed
  }
}