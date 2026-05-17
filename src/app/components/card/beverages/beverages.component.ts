// beverages.component.ts
import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { BeveragesService } from '../../../services/beverages/beverages.service';

@Component({
  selector: 'app-beverages',
  templateUrl: './beverages.component.html',
  styleUrls: ['./beverages.component.css']
})
export class BeveragesComponent implements OnInit {

  beverages: any[] = [];

  constructor(
    private beveragesService: BeveragesService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {

    this.beveragesService.getAll().subscribe(
      (data) => {
        this.beverages = data;

        this.beverages.forEach(beverage => {
          if (beverage.quantity === undefined) {
            beverage.quantity = 0;
          }
          beverage.priceValue = this.extractPriceFromString(beverage.price);
        });
      },
      (error) => {
        console.error('Error fetching beverages data', error);
      }
    );
  }

  // Helper method to extract price from string
  private extractPriceFromString(priceString: string): number {
    // Match numbers (including decimals) from the string
    const match = priceString.match(/(\d+(\.\d+)?)/);
    if (match) {
      return parseFloat(match[0]);
    }
    return 0; // Default to 0 if no number found
  }

  increaseQuantity(beverage: any) {
    beverage.quantity = (beverage.quantity || 0) + 1;
  }

  decreaseQuantity(beverage: any) {
    if (beverage.quantity > 0) {
      beverage.quantity--;
    }
  }

  addToCart(beverage: any) {

    if (beverage.quantity > 0) {

      this.cartService.addItem({
        itemId: beverage.id,
        name: beverage.title,
        price: beverage.priceValue,
        category: 'Beverages',
        quantity: beverage.quantity,
        image: beverage.image
      });
      beverage.quantity = 0;

    } else {

    }
  }
}