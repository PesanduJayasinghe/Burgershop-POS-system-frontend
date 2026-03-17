import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  imports: [CommonModule, RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit {
  
  constructor(private router: Router) {}

  ngOnInit(): void {
    // Initialize to burgers if no route is active
    if (this.router.url === '/') {
      this.navigateTo('burgers');
    }
  }

  // Navigate to the selected category
  navigateTo(category: string): void {
    this.router.navigate([category]);
  }

  // Check if the current route is active
  isActive(category: string): boolean {
    return this.router.url.includes(category);
  }
} 
