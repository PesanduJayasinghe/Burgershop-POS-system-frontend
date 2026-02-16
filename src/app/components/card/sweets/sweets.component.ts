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
          // sweet.priceValue = this.extractPriceFromString(sweet.price);

          console.log(`Sweet: ${sweet.title}, Price string: ${sweet.price}, Price value: ${sweet.priceValue}`);
        });
      },
      (error) => {
        console.error('Error fetching sweets data', error);
      }
    );
  }

 
}
