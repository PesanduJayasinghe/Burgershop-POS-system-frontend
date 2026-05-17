import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { SideBarComponent } from '../../components/side-bar/side-bar.component';
import { AuthService } from '../../services/auth/auth.service';
import { Cashier } from '../../model/cashier.model';

@Component({
    selector: 'app-profile',
    imports: [CommonModule, NavBarComponent, SideBarComponent],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
    cashier: Cashier | null = null;

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.cashier = this.authService.getCurrentCashier();
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
