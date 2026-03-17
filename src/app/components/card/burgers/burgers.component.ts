// burgers.component.ts
import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { BurgersService } from '../../../services/burgers/burgers.service';

@Component({
  selector: 'app-burgers',
  templateUrl: './burgers.component.html',
  styleUrls: ['./burgers.component.css']
})
export class BurgersComponent implements OnInit {

  burgers: any[] = [];
  
  constructor(
    private burgerService: BurgersService,
    private cartService: CartService
  ) {}

  // ngOnInit(): void {
  //   // this.burgers = this.burgerService.getBurgers();
    
  //   // Add priceValue by extracting from price string
  //   this.burgers.forEach(burger => {
  //     if (burger.quantity === undefined) {
  //       burger.quantity = 0;
  //     }
      
  //     // Extract numeric price from price string
  //     // Example: "LKR 500.00/=" → 500
  //     burger.priceValue = this.extractPriceFromString(burger.price);
      
  //     console.log(`Burger: ${burger.title}, Price string: ${burger.price}, Price value: ${burger.priceValue}`);
  //   });
  // }

  ngOnInit(): void {
    // Subscribe to the Observable returned by BurgersService
    this.burgerService.getAll().subscribe(
      (data) => {
        // Once the data is received, assign it to the burgers array
        this.burgers = data;

        // Add priceValue by extracting from price string
        this.burgers.forEach(burger => {
          if (burger.quantity === undefined) {
            burger.quantity = 0;
          }

          // Extract numeric price from price string
          burger.priceValue = this.extractPriceFromString(burger.price);

          console.log(`Burger: ${burger.title}, Price string: ${burger.price}, Price value: ${burger.priceValue}`);
        });
      },
      (error) => {
        console.error('Error fetching burgers data', error);
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

  increaseQuantity(burger: any) {
    burger.quantity = (burger.quantity || 0) + 1;
    console.log(`Increased ${burger.title} quantity to: ${burger.quantity}`);
  }

  decreaseQuantity(burger: any) {
    if (burger.quantity > 0) {
      burger.quantity--;
      console.log(`Decreased ${burger.title} quantity to: ${burger.quantity}`);
    }
  }

  addToCart(burger: any) {
    
      if (burger.quantity > 0) {

      this.cartService.addItem({
        name: burger.title,
        price: burger.priceValue,
        category: 'Burgers',
        quantity: burger.quantity,
        image : burger.image
      });
      burger.quantity = 0;
    
    } else {

    }
  }
}