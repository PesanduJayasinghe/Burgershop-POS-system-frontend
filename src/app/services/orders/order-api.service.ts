import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderNotification } from '../../model/order-notification.model';

export interface CheckoutItem {
    itemType: 'BURGER' | 'BEVERAGE' | 'SWEET';
    itemId: number;
    quantity: number;
    unitPrice: number;
}

export interface CheckoutRequest {
    cashierName: string;
    totalAmount: number;
    items: CheckoutItem[];
}

export interface CheckoutResponse {
    orderId: number;
    placedAt: string;
    readyAt: string;
    message: string;
}

@Injectable({
    providedIn: 'root'
})
export class OrderApiService {
    private readonly checkoutUrl = 'http://localhost:8080/orders/checkout';
    private readonly notificationsUrl = 'http://localhost:8080/orders/ready-notifications';

    constructor(private http: HttpClient) { }

    checkout(payload: CheckoutRequest): Observable<CheckoutResponse> {
        return this.http.post<CheckoutResponse>(this.checkoutUrl, payload);
    }

    getReadyNotifications(): Observable<OrderNotification[]> {
        return this.http.get<OrderNotification[]>(this.notificationsUrl);
    }
}
