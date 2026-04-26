import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Cashier } from '../../model/cashier.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly loginUrl = 'http://localhost:8080/cashiers/login';
    private readonly signupUrl = 'http://localhost:8080/cashiers/signup';
    private readonly storageKey = 'currentCashier';

    constructor(private http: HttpClient) { }

    login(name: string, password: string): Observable<Cashier> {
        return this.http.post<Cashier>(this.loginUrl, { name, password }).pipe(
            tap((cashier) => localStorage.setItem(this.storageKey, JSON.stringify(cashier)))
        );
    }

    signup(name: string, password: string): Observable<Cashier> {
        return this.http.post<Cashier>(this.signupUrl, { name, password });
    }

    logout(): void {
        localStorage.removeItem(this.storageKey);
    }

    getCurrentCashier(): Cashier | null {
        const value = localStorage.getItem(this.storageKey);
        return value ? (JSON.parse(value) as Cashier) : null;
    }

    isLoggedIn(): boolean {
        return this.getCurrentCashier() !== null;
    }
}
