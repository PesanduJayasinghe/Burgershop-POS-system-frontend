import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from '../../components/nav-bar/nav-bar.component';
import { SideBarComponent } from '../../components/side-bar/side-bar.component';
import { OrderApiService } from '../../services/orders/order-api.service';
import { OrderNotification } from '../../model/order-notification.model';

@Component({
    selector: 'app-notifications',
    imports: [CommonModule, NavBarComponent, SideBarComponent],
    templateUrl: './notifications.component.html',
    styleUrl: './notifications.component.css'
})
export class NotificationsComponent implements OnInit, OnDestroy {
    notifications: OrderNotification[] = [];
    isLoading = false;
    private refreshTimer: ReturnType<typeof setInterval> | null = null;

    constructor(private orderApiService: OrderApiService) { }

    ngOnInit(): void {
        this.loadNotifications();
        this.refreshTimer = setInterval(() => this.loadNotifications(), 30000);
    }

    ngOnDestroy(): void {
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
        }
    }

    loadNotifications(): void {
        this.isLoading = true;
        this.orderApiService.getReadyNotifications().subscribe({
            next: (data) => {
                this.notifications = data;
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
            }
        });
    }

    formatTime(value: string): string {
        return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
}
