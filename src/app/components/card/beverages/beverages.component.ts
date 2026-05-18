import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../services/cart.service';
import { BeveragesService } from '../../../services/beverages/beverages.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-beverages',
  imports: [CommonModule, FormsModule],
  templateUrl: './beverages.component.html',
  styleUrls: ['./beverages.component.css']
})
export class BeveragesComponent implements OnInit {

  beverages: any[] = [];
  isEditModalOpen = false;
  isAddModalOpen = false;
  editItem: any = {};
  newItem: any = { title: '', price: '', image: '', quantity: 10 };
  addError = '';

  constructor(
    private beveragesService: BeveragesService,
    private cartService: CartService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadBeverages();
  }

  loadBeverages(): void {
    this.beveragesService.getAll().subscribe({
      next: (data) => {
        this.beverages = data;
        this.beverages.forEach(beverage => {
          if (beverage.quantity === undefined) {
            beverage.quantity = 0;
          }
          beverage.priceValue = this.extractPriceFromString(beverage.price);
        });

        // Reorder out-of-stock items (quantity === 0) to the bottom of the list
        this.beverages.sort((a, b) => {
          if (a.quantity === 0 && b.quantity > 0) return 1;
          if (a.quantity > 0 && b.quantity === 0) return -1;
          return 0;
        });
      },
      error: (err) => {
        console.error('Error fetching beverages data', err);
      }
    });
  }

  isAdmin(): boolean {
    return this.authService.getCurrentCashier()?.role === 'ADMIN';
  }

  private extractPriceFromString(priceString: string): number {
    const match = priceString.match(/(\d+(\.\d+)?)/);
    return match ? parseFloat(match[0]) : 0;
  }

  increaseQuantity(beverage: any): void {
    if (beverage.quantity > 0) {
      beverage.orderQuantity = (beverage.orderQuantity || 0) + 1;
      // Cap at actual stock quantity
      if (beverage.orderQuantity > beverage.quantity) {
        beverage.orderQuantity = beverage.quantity;
      }
    }
  }

  decreaseQuantity(beverage: any): void {
    if (beverage.orderQuantity > 0) {
      beverage.orderQuantity--;
    }
  }

  addToCart(beverage: any): void {
    const qty = beverage.orderQuantity || 0;
    if (qty > 0 && beverage.quantity >= qty) {
      this.cartService.addItem({
        itemId: beverage.id,
        name: beverage.title,
        price: beverage.priceValue,
        category: 'Beverages',
        quantity: qty,
        image: beverage.image
      });
      // Deduct stock locally so UI updates nicely
      beverage.quantity -= qty;
      beverage.orderQuantity = 0;

      // Update backend item quantity
      this.beveragesService.update(beverage.id, beverage).subscribe({
        next: () => this.loadBeverages()
      });
    }
  }

  openEditModal(beverage: any, event: Event): void {
    event.stopPropagation();
    this.editItem = { ...beverage };
    this.isEditModalOpen = true;
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
  }

  saveEditItem(): void {
    if (!this.editItem.title || !this.editItem.price || this.editItem.quantity === undefined) {
      alert('Please fill all fields');
      return;
    }
    this.beveragesService.update(this.editItem.id, this.editItem).subscribe({
      next: () => {
        this.loadBeverages();
        this.closeEditModal();
      },
      error: (err) => {
        console.error('Failed to update beverage', err);
      }
    });
  }

  openAddModal(): void {
    this.newItem = { title: '', price: '', image: '', quantity: 10 };
    this.addError = '';
    this.isAddModalOpen = true;
  }

  closeAddModal(): void {
    this.isAddModalOpen = false;
  }

  saveNewItem(): void {
    if (!this.newItem.title || !this.newItem.price || !this.newItem.image || this.newItem.quantity === undefined) {
      this.addError = 'fill all fields';
      return;
    }
    // Prefix image path if not done
    if (!this.newItem.image.startsWith('img/') && !this.newItem.image.startsWith('http')) {
      this.newItem.image = 'img/Bevarage/' + this.newItem.image;
    }
    this.beveragesService.save(this.newItem).subscribe({
      next: () => {
        this.loadBeverages();
        this.closeAddModal();
      },
      error: (err) => {
        console.error('Failed to add beverage', err);
        this.addError = 'Failed to create item. Check details.';
      }
    });
  }

}