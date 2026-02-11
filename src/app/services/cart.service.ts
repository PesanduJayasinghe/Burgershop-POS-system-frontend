// cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  name: string;
  price: number;
  quantity: number;
  total: number;
  category?: string;
}

export interface OrderSummary {
  subtotal: number;
  tax: number;
  serviceFee: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private orderItemsSubject = new BehaviorSubject<CartItem[]>([]);
  orderItems$ = this.orderItemsSubject.asObservable();
  
  private orderSummarySubject = new BehaviorSubject<OrderSummary>({
    subtotal: 0,
    tax: 0,
    serviceFee: 50,
    total: 50
  });
  orderSummary$ = this.orderSummarySubject.asObservable();

  constructor() {}

  // Add item to cart
  // In cart.service.ts - update addItem method
addItem(item: { name: string; price: number; category?: string; quantity?: number }) {
  console.log('=== CART SERVICE ===');
  console.log('Adding item:', item);
  
  const quantity = item.quantity || 1; // Default to 1 if not specified
  const validPrice = Number(item.price) || 0;
  
  console.log(`Quantity: ${quantity}, Price: ${validPrice}`);
  
  const currentItems = this.orderItemsSubject.value;
  const existingItemIndex = currentItems.findIndex(i => i.name === item.name);
  
  if (existingItemIndex > -1) {
    // Update existing item
    const updatedItems = [...currentItems];
    updatedItems[existingItemIndex].quantity += quantity;
    updatedItems[existingItemIndex].total = 
      validPrice * updatedItems[existingItemIndex].quantity;
    
    console.log(`Updated existing item: ${item.name}, new quantity: ${updatedItems[existingItemIndex].quantity}`);
    
    this.orderItemsSubject.next(updatedItems);
  } else {
    // Add new item
    const newItem: CartItem = {
      name: item.name,
      price: validPrice,
      quantity: quantity,
      total: validPrice * quantity,
      category: item.category
    };
    
    console.log(`Added new item:`, newItem);
    this.orderItemsSubject.next([...currentItems, newItem]);
  }
  
  this.updateOrderSummary();
}

  // Remove item from cart
  removeItem(index: number) {
    const currentItems = this.orderItemsSubject.value;
    const updatedItems = currentItems.filter((_, i) => i !== index);
    this.orderItemsSubject.next(updatedItems);
    this.updateOrderSummary();
  }

  // Update item quantity
  updateItemQuantity(index: number, newQuantity: number) {
    const currentItems = this.orderItemsSubject.value;
    const updatedItems = [...currentItems];
    
    if (newQuantity <= 0) {
      // Remove item if quantity is 0 or negative
      updatedItems.splice(index, 1);
    } else {
      updatedItems[index].quantity = newQuantity;
      updatedItems[index].total = updatedItems[index].price * newQuantity;
    }
    
    this.orderItemsSubject.next(updatedItems);
    this.updateOrderSummary();
  }

  // Clear all items
  clearCart() {
    this.orderItemsSubject.next([]);
    this.updateOrderSummary();
  }

  // Calculate order summary
  private updateOrderSummary() {
    const items = this.orderItemsSubject.value;
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.08;
    const serviceFee = 50;
    const total = subtotal + tax + serviceFee;
    
    this.orderSummarySubject.next({
      subtotal,
      tax,
      serviceFee,
      total
    });
  }

  // Get current items
  getOrderItems(): CartItem[] {
    return this.orderItemsSubject.value;
  }

  // Get current summary
  getOrderSummary(): OrderSummary {
    return this.orderSummarySubject.value;
  }
}