import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
    selector: 'app-signup',
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './signup.component.html',
    styleUrl: './signup.component.css'
})
export class SignupComponent {
    name = '';
    password = 'pos123';
    error = '';
    success = '';

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    onSignUp(): void {
        this.error = '';
        this.success = '';

        this.authService.signup(this.name, this.password).subscribe({
            next: () => {
                this.success = 'Account created successfully. Redirecting to login...';
                setTimeout(() => this.router.navigate(['/login']), 1000);
            },
            error: (err) => {
                this.error = err.error || 'Sign up failed.';
            }
        });
    }
}
