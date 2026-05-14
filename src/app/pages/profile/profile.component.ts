import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { SideBarComponent } from '../../components/side-bar/side-bar.component';
import { AuthService } from '../../services/auth/auth.service';
import { Cashier } from '../../model/cashier.model';

@Component({
    selector: 'app-profile',
    imports: [CommonModule, FormsModule, NavBarComponent, SideBarComponent],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
    cashier: Cashier | null = null;
    cashiers: Cashier[] = [];
    
    // Register Account Form fields
    newName = '';
    newPassword = '';
    newRole = 'CASHIER';
    registerError = '';
    registerSuccess = '';

    // Password editing/visibility map
    revealedPasswords: { [id: number]: boolean } = {};
    editPasswords: { [id: number]: string } = {};

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.cashier = this.authService.getCurrentCashier();
        if (this.isAdmin()) {
            this.loadCashiers();
        }
    }

    isAdmin(): boolean {
        return this.cashier?.role === 'ADMIN';
    }

    loadCashiers(): void {
        this.authService.getAllCashiers().subscribe({
            next: (data) => {
                this.cashiers = data;
                // Initialize default edit values
                this.cashiers.forEach(c => {
                    this.editPasswords[c.id] = c.password || '';
                });
            },
            error: (err) => {
                console.error('Failed to load accounts list', err);
            }
        });
    }

    createAccount(): void {
        this.registerError = '';
        this.registerSuccess = '';

        if (!this.newName || !this.newPassword || !this.newRole) {
            this.registerError = 'fill all fields';
            return;
        }

        const newAccount = {
            name: this.newName.trim(),
            password: this.newPassword,
            role: this.newRole
        };

        this.authService.signup(newAccount).subscribe({
            next: (res: any) => {
                this.registerSuccess = `Account for ${res.name} successfully created!`;
                this.newName = '';
                this.newPassword = '';
                this.newRole = 'CASHIER';
                this.loadCashiers();
            },
            error: (err: any) => {
                this.registerError = err.error || 'Failed to create account. Username may be taken.';
            }
        });
    }

    togglePasswordVisibility(id: number): void {
        this.revealedPasswords[id] = !this.revealedPasswords[id];
    }

    isPasswordRevealed(id: number): boolean {
        return !!this.revealedPasswords[id];
    }

    updateAccount(c: Cashier): void {
        const newPassword = this.editPasswords[c.id];
        if (!newPassword || newPassword.trim() === '') {
            alert('Password cannot be empty');
            return;
        }

        const updated = {
            ...c,
            password: newPassword
        };

        this.authService.updateCashier(c.id, updated).subscribe({
            next: () => {
                alert('Account updated successfully!');
                this.revealedPasswords[c.id] = false;
                this.loadCashiers();
            },
            error: (err) => {
                console.error('Failed to update account', err);
                alert('Error updating cashier account.');
            }
        });
    }

    deleteAccount(c: Cashier): void {
        if (c.id === this.cashier?.id) {
            alert('You cannot delete your own logged-in admin account!');
            return;
        }

        if (confirm(`Are you sure you want to delete ${c.name}'s account?`)) {
            this.authService.deleteCashier(c.id).subscribe({
                next: () => {
                    this.loadCashiers();
                },
                error: (err) => {
                    console.error('Failed to delete account', err);
                    alert('Error deleting cashier account.');
                }
            });
        }
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
