import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../services/cart.service';
import { SweetsService } from '../../../services/sweets/sweets.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-sweets',
  imports: [CommonModule, FormsModule],
  templateUrl: './sweets.component.html',
  styleUrls: ['./sweets.component.css']
})
export class SweetsComponent implements OnInit {

  sweets: any[] = [];
  isEditModalOpen = false;
  isAddModalOpen = false;
  editItem: any = {};
  newItem: any = { title: '', price: '', image: '', quantity: 10 };
  addError = '';

  constructor(
    private sweetsService: SweetsService,
    private cartService: CartService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadSweets();
  }

  loadSweets(): void {
    this.sweetsService.getAll().subscribe({
      next: (data) => {
        this.sweets = data;
        this.sweets.forEach(sweet => {
          if (sweet.quantity === undefined) {
            sweet.quantity = 0;
          }
          sweet.priceValue = this.extractPriceFromString(sweet.price);
        });

        // Reorder out-of-stock items (quantity === 0) to the bottom of the list
        this.sweets.sort((a, b) => {
          if (a.quantity === 0 && b.quantity > 0) return 1;
          if (a.quantity > 0 && b.quantity === 0) return -1;
          return 0;
        });
      },
      error: (err) => {
        console.error('Error fetching sweets data', err);
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

  increaseQuantity(sweet: any): void {
    if (sweet.quantity > 0) {
      sweet.orderQuantity = (sweet.orderQuantity || 0) + 1;
      // Cap at actual stock quantity
      if (sweet.orderQuantity > sweet.quantity) {
        sweet.orderQuantity = sweet.quantity;
      }
    }
  }

  decreaseQuantity(sweet: any): void {
    if (sweet.orderQuantity > 0) {
      sweet.orderQuantity--;
    }
  }

  addToCart(sweet: any): void {
    const qty = sweet.orderQuantity || 0;
    if (qty > 0 && sweet.quantity >= qty) {
      this.cartService.addItem({
        itemId: sweet.id,
        name: sweet.title,
        price: sweet.priceValue,
        category: 'Sweets',
        quantity: qty,
        image: sweet.image
      });
      // Deduct stock locally so UI updates nicely
      sweet.quantity -= qty;
      sweet.orderQuantity = 0;

      // Update backend item quantity
      this.sweetsService.update(sweet.id, sweet).subscribe({
        next: () => this.loadSweets()
      });
    }
  }

  openEditModal(sweet: any, event: Event): void {
    event.stopPropagation();
    this.editItem = { ...sweet };
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
    this.sweetsService.update(this.editItem.id, this.editItem).subscribe({
      next: () => {
        this.loadSweets();
        this.closeEditModal();
      },
      error: (err) => {
        console.error('Failed to update sweet', err);
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
      this.newItem.image = 'img/Sweet/' + this.newItem.image;
    }
    this.sweetsService.save(this.newItem).subscribe({
      next: () => {
        this.loadSweets();
        this.closeAddModal();
      },
      error: (err) => {
        console.error('Failed to add sweet', err);
        this.addError = 'Failed to create item. Check details.';
      }
    });
  }

}
