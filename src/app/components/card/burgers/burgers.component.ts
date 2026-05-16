import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../services/cart.service';
import { BurgersService } from '../../../services/burgers/burgers.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-burgers',
  imports: [CommonModule, FormsModule],
  templateUrl: './burgers.component.html',
  styleUrls: ['./burgers.component.css']
})
export class BurgersComponent implements OnInit {

  burgers: any[] = [];
  isEditModalOpen = false;
  isAddModalOpen = false;
  editItem: any = {};
  newItem: any = { title: '', price: '', image: '', quantity: 10 };
  addError = '';

  constructor(
    private burgerService: BurgersService,
    private cartService: CartService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadBurgers();
  }

  loadBurgers(): void {
    this.burgerService.getAll().subscribe({
      next: (data) => {
        this.burgers = data;
        this.burgers.forEach(burger => {
          if (burger.quantity === undefined) {
            burger.quantity = 0;
          }
          burger.priceValue = this.extractPriceFromString(burger.price);
        });

        // Reorder out-of-stock items (quantity === 0) to the bottom of the list
        this.burgers.sort((a, b) => {
          if (a.quantity === 0 && b.quantity > 0) return 1;
          if (a.quantity > 0 && b.quantity === 0) return -1;
          return 0;
        });
      },
      error: (err) => {
        console.error('Error fetching burgers data', err);
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

  increaseQuantity(burger: any): void {
    if (burger.quantity > 0) {
      burger.orderQuantity = (burger.orderQuantity || 0) + 1;
      // Cap at actual stock quantity
      if (burger.orderQuantity > burger.quantity) {
        burger.orderQuantity = burger.quantity;
      }
    }
  }

  decreaseQuantity(burger: any): void {
    if (burger.orderQuantity > 0) {
      burger.orderQuantity--;
    }
  }

  addToCart(burger: any): void {
    const qty = burger.orderQuantity || 0;
    if (qty > 0 && burger.quantity >= qty) {
      this.cartService.addItem({
        itemId: burger.id,
        name: burger.title,
        price: burger.priceValue,
        category: 'Burgers',
        quantity: qty,
        image: burger.image
      });
      // Deduct stock locally so UI updates nicely
      burger.quantity -= qty;
      burger.orderQuantity = 0;

      // Update backend item quantity
      this.burgerService.update(burger.id, burger).subscribe({
        next: () => this.loadBurgers()
      });
    }
  }

  openEditModal(burger: any, event: Event): void {
    event.stopPropagation();
    this.editItem = { ...burger };
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
    this.burgerService.update(this.editItem.id, this.editItem).subscribe({
      next: () => {
        this.loadBurgers();
        this.closeEditModal();
      },
      error: (err) => {
        console.error('Failed to update burger', err);
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
      this.newItem.image = 'img/Burger/' + this.newItem.image;
    }
    this.burgerService.save(this.newItem).subscribe({
      next: () => {
        this.loadBurgers();
        this.closeAddModal();
      },
      error: (err) => {
        console.error('Failed to add burger', err);
        this.addError = 'Failed to create item. Check details.';
      }
    });
  }

}