import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { SweetsService } from '../../../services/sweets/sweets.service';

@Component({
  selector: 'app-sweets',
  templateUrl: './sweets.component.html',
  styleUrls: ['./sweets.component.css']
})
export class SweetsComponent implements OnInit {

  sweets: any[] = [];
  
  constructor(
    private sweetsService: SweetsService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // Subscribe to the Observable returned by the SweetsService
    this.sweetsService.getSweets().subscribe(
      (data) => {
        // Once the data is received, assign it to the sweets array
        this.sweets = data;

        // Add priceValue by extracting from price string
        this.sweets.forEach(sweet => {
          if (sweet.quantity === undefined) {
            sweet.quantity = 0;
          }

          // Extract numeric price from price string
          sweet.priceValue = this.extractPriceFromString(sweet.price);

          console.log(`Sweet: ${sweet.title}, Price string: ${sweet.price}, Price value: ${sweet.priceValue}`);
        });
      },
      (error) => {
        console.error('Error fetching sweets data', error);
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

  increaseQuantity(sweet: any) {
    sweet.quantity = (sweet.quantity || 0) + 1;
    console.log(`Increased ${sweet.title} quantity to: ${sweet.quantity}`);
  }

  decreaseQuantity(sweet: any) {
    if (sweet.quantity > 0) {
      sweet.quantity--;
      console.log(`Decreased ${sweet.title} quantity to: ${sweet.quantity}`);
    }
  }

  addToCart(sweet: any) {
    
    if (sweet.quantity > 0) {
      // Add item to cart service WITH QUANTITY
      this.cartService.addItem({
        name: sweet.title,
        price: sweet.priceValue,
        category: 'Sweets',
        quantity: sweet.quantity ,
        image : sweet.image
      });
      
      // Reset quantity after adding to cart
      sweet.quantity = 0;
      console.log(`Added ${sweet.quantity} items to cart`);
    } else {
      console.log('Quantity is 0, not adding to cart');
    }
  }
}
