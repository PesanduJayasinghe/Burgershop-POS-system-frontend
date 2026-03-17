import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { OrderSummaryComponent } from '../../components/order-summary/order-summary.component';
import { SideBarComponent } from "../../components/side-bar/side-bar.component";


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, NavBarComponent, OrderSummaryComponent, SideBarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent { 
  isSidebarExpanded = false;
  
  toggleSidebar(): void {
    if (window.innerWidth <= 768) {
      this.isSidebarExpanded = !this.isSidebarExpanded;
      const sidebar = document.getElementById('mobileSidebar');
      if (sidebar) {
        if (this.isSidebarExpanded) {
          sidebar.classList.add('expanded');
        } else {
          sidebar.classList.remove('expanded');
        }
      }
    }
  }
  
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    // Auto-collapse sidebar when resizing to larger screen
    if (window.innerWidth > 768) {
      this.isSidebarExpanded = false;
      const sidebar = document.getElementById('mobileSidebar');
      if (sidebar) {
        sidebar.classList.remove('expanded');
      }
    }
  }
}