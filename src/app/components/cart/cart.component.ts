import { Component, OnInit } from '@angular/core';
import { CartItem, CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {

  orderItems: CartItem[] = [];

  constructor(private cartService: CartService) { }

  ngOnInit(): void {

    this.cartService.orderItems$.subscribe(items => {
      this.orderItems = items;
    });

  }

  increaseQuantity(index: number): void {
    const newQuantity = (this.orderItems[index].quantity || 0) + 1;
    this.cartService.updateItemQuantity(index, newQuantity);
  }

  decreaseQuantity(index: number): void {
    const newQuantity = (this.orderItems[index].quantity || 0) - 1;
    this.cartService.updateItemQuantity(index, newQuantity);
  }

  // Safe number formatting methods
  getItemTotal(item: CartItem): string {
    const total = item.total || (item.price || 0) * (item.quantity || 1);
    return this.formatNumber(total);
  }

  getItemPrice(item: CartItem): string {
    return this.formatNumber(item.price || 0);
  }

  private formatNumber(value: number): string {
    return value.toFixed(2);
  }

  removeItem(index: number): void {
    this.cartService.removeItem(index);
  }

  // Add this method to your CartComponent class
  getItemClass(category: string | undefined): string {
    switch (category?.toLowerCase()) {
      case 'burgers':
        return 'burger-item';
      case 'beverages':
        return 'beverage-item';
      case 'sweets':
        return 'sweet-item';
      default:
        return 'default-item';
    }
  }

}
