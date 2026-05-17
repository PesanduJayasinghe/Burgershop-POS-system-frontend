// ordersummary.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem, CartService, OrderSummary } from '../../services/cart.service';
import { Router, RouterModule } from '@angular/router';
import { OrderApiService } from '../../services/orders/order-api.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css'],
  imports: [CommonModule, RouterModule]
})
export class OrderSummaryComponent implements OnInit {
  orderItems: CartItem[] = [];
  orderSummary: OrderSummary = {
    subtotal: 0,
    tax: 0,
    serviceFee: 50,
    total: 50
  };

  constructor(
    private cartService: CartService,
    private orderApiService: OrderApiService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Subscribe to cart changes
    this.cartService.orderItems$.subscribe(items => {
      this.orderItems = items;
    });

    this.cartService.orderSummary$.subscribe(summary => {
      this.orderSummary = summary;
    });
  }

  getItemCount(): number {
    return this.orderItems.reduce((total, item) => total + (item.quantity || 0), 0);
  }

  // Safe number formatting methods
  getItemTotal(item: CartItem): string {
    const total = item.total || (item.price || 0) * (item.quantity || 1);
    return this.formatNumber(total);
  }

  getItemPrice(item: CartItem): string {
    return this.formatNumber(item.price || 0);
  }

  getSafeNumber(value: number | undefined | null): string {
    if (value === undefined || value === null || isNaN(value)) {
      return '0.00';
    }
    return this.formatNumber(value);
  }

  private formatNumber(value: number): string {
    return value.toFixed(2);
  }

  increaseQuantity(index: number): void {
    const newQuantity = (this.orderItems[index].quantity || 0) + 1;
    this.cartService.updateItemQuantity(index, newQuantity);
  }

  decreaseQuantity(index: number): void {
    const newQuantity = (this.orderItems[index].quantity || 0) - 1;
    this.cartService.updateItemQuantity(index, newQuantity);
  }

  removeItem(index: number): void {
    this.cartService.removeItem(index);
  }

  clearOrder(): void {
    this.cartService.clearCart();
  }

  proceedToCheckout(): void {
    if (this.orderItems.length === 0) {
      alert('Please add items to cart first!');
      return;
    }

    const currentCashier = this.authService.getCurrentCashier();

    if (!currentCashier) {
      alert('Please login as a cashier before checkout.');
      this.router.navigate(['/login']);
      return;
    }

    const items = this.orderItems
      .filter((item) => !!item.itemId)
      .map((item) => ({
        itemType: this.mapCategoryToItemType(item.category),
        itemId: item.itemId as number,
        quantity: item.quantity,
        unitPrice: item.price
      }));

    if (items.length === 0) {
      alert('Unable to checkout: item IDs are missing.');
      return;
    }

    this.orderApiService.checkout({
      cashierName: currentCashier.name,
      totalAmount: this.orderSummary.total,
      items
    }).subscribe({
      next: (response) => {
        alert(`Order ${response.orderId} placed successfully! Ready in 5 minutes.`);
        this.clearOrder();
      },
      error: () => {
        alert('Checkout failed. Please try again.');
      }
    });
  }

  private mapCategoryToItemType(category: string | undefined): 'BURGER' | 'BEVERAGE' | 'SWEET' {
    const value = (category || '').toLowerCase();

    if (value.includes('burger')) {
      return 'BURGER';
    }

    if (value.includes('beverage')) {
      return 'BEVERAGE';
    }

    return 'SWEET';
  }
}