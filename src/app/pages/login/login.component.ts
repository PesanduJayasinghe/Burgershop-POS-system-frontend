import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
    selector: 'app-login',
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
    name = '';
    password = 'pos123';
    error = '';

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    onLogin(): void {
        this.error = '';
        this.authService.login(this.name, this.password).subscribe({
            next: () => this.router.navigate(['/']),
            error: (err) => {
                this.error = err.error || 'Login failed. Check name/password.';
            }
        });
    }
}
