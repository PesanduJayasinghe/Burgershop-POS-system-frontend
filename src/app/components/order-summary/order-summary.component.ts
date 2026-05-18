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
        const receiptData = {
          orderId: response.orderId,
          date: new Date().toLocaleString(),
          cashierName: currentCashier.name,
          items: this.orderItems.map(item => ({
            name: item.name,
            price: item.price || 0,
            quantity: item.quantity || 0,
            total: (item.price || 0) * (item.quantity || 0)
          })),
          subtotal: this.orderSummary.subtotal || 0,
          tax: this.orderSummary.tax || 0,
          serviceFee: this.orderSummary.serviceFee || 0,
          total: this.orderSummary.total || 0
        };

        this.printReceipt(receiptData);
        alert(`Order ${response.orderId} placed successfully! Ready in 5 minutes.`);
        this.clearOrder();
      },
      error: () => {
        alert('Checkout failed. Please try again.');
      }
    });
  }

  printReceipt(receiptData: any): void {
    const printWindow = window.open('', '_blank', 'width=600,height=800');
    if (!printWindow) {
      alert('Popup blocker prevented printing receipt. Please allow popups for this site.');
      return;
    }

    const itemsHtml = receiptData.items.map((item: any) => `
      <tr>
        <td style="text-align: left; padding: 6px 0; vertical-align: top;">
          <div style="font-weight: bold; color: #1a1a1a;">${item.name}</div>
          <span style="font-size: 11px; color: #666;">LKR ${item.price.toFixed(2)} each</span>
        </td>
        <td style="text-align: center; padding: 6px 0; vertical-align: top; font-weight: bold; color: #1a1a1a;">${item.quantity}</td>
        <td style="text-align: right; padding: 6px 0; vertical-align: top; font-weight: bold; color: #1a1a1a;">LKR ${item.total.toFixed(2)}</td>
      </tr>
    `).join('');

    const receiptHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt - Order #${receiptData.orderId}</title>
        <style>
          @page {
            size: 80mm auto;
            margin: 0;
          }
          body {
            font-family: 'Courier New', Courier, monospace;
            font-size: 13px;
            line-height: 1.4;
            color: #000000;
            margin: 0;
            padding: 15px;
            width: 72mm;
            background: #ffffff;
          }
          .text-center { text-align: center; }
          .text-left { text-align: left; }
          .text-right { text-align: right; }
          .divider {
            border-top: 1px dashed #000000;
            margin: 8px 0;
          }
          .divider-double {
            border-top: 3px double #000000;
            margin: 8px 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            margin: 4px 0;
          }
          .grand-total {
            font-size: 16px;
            font-weight: bold;
          }
          .footer {
            margin-top: 24px;
            text-align: center;
            font-size: 11px;
          }
          .order-number-box {
            border: 2px dashed #000000;
            padding: 10px;
            margin: 16px 0;
            font-size: 20px;
            font-weight: bold;
            text-align: center;
            letter-spacing: 1px;
          }
        </style>
      </head>
      <body>
        <div class="text-center">
          <h2 style="margin: 0 0 4px 0; font-size: 20px; font-weight: 900;">🍔 BURGER SHOP 🍔</h2>
          <p style="margin: 0; font-size: 11px; color: #333;">123 Flavor Street, Colombo</p>
          <p style="margin: 2px 0 0 0; font-size: 11px; color: #333;">Tel: +94 11 234 5678</p>
        </div>
        
        <div class="divider-double"></div>
        
        <div style="font-size: 12px; margin-bottom: 8px;">
          <strong>Order ID:</strong> #${receiptData.orderId}<br>
          <strong>Date:</strong> ${receiptData.date}<br>
          <strong>Cashier:</strong> ${receiptData.cashierName}
        </div>
        
        <div class="divider"></div>
        
        <table>
          <thead>
            <tr>
              <th class="text-left" style="border-bottom: 1px solid #000000; padding-bottom: 4px;">Item</th>
              <th class="text-center" style="border-bottom: 1px solid #000000; padding-bottom: 4px; width: 40px;">Qty</th>
              <th class="text-right" style="border-bottom: 1px solid #000000; padding-bottom: 4px; width: 100px;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        <div class="divider"></div>
        
        <div class="total-row">
          <span>Subtotal:</span>
          <span>LKR ${receiptData.subtotal.toFixed(2)}</span>
        </div>
        <div class="total-row">
          <span>Tax (8%):</span>
          <span>LKR ${receiptData.tax.toFixed(2)}</span>
        </div>
        <div class="total-row">
          <span>Service Fee:</span>
          <span>LKR ${receiptData.serviceFee.toFixed(2)}</span>
        </div>
        
        <div class="divider-double"></div>
        
        <div class="total-row grand-total">
          <span>TOTAL:</span>
          <span>LKR ${receiptData.total.toFixed(2)}</span>
        </div>
        
        <div class="divider-double"></div>
        
        <div class="order-number-box">
          ORDER NO: ${receiptData.orderId}
        </div>
        
        <div class="footer">
          <p style="margin: 0; font-weight: bold;">Thank you for dining with us!</p>
          <p style="margin: 4px 0 0 0;">Please Come Again</p>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() {
              window.close();
            }, 1000);
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(receiptHtml);
    printWindow.document.close();
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