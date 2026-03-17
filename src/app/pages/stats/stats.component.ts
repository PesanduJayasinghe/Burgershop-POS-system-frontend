import { Component, OnInit } from '@angular/core';
import { NavBarComponent } from "../../components/nav-bar/nav-bar.component";
import { SideBarComponent } from "../../components/side-bar/side-bar.component";
import { CalendarComponent } from "../../components/calender/calender.component";
import { RevenueTrend } from '../../model/revenueTrend.model';
import { StatsService } from '../../services/stats/stats.service';
import { TopProducts } from '../../model/topProducts.model';
import { BurgersService } from '../../services/burgers/burgers.service';
import { BeveragesService } from '../../services/beverages/beverages.service';
import { SweetsService } from '../../services/sweets/sweets.service';
import { Burger } from '../../model/burger.model';
import { Sweet } from '../../model/sweet.model';
import { Beverage } from '../../model/beverage.model';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats',
  imports: [NavBarComponent, SideBarComponent, CalendarComponent, CommonModule],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css'
})
export class StatsComponent implements OnInit {

  todayRevenue: Number = 0;
  todayCutomer: Number = 0;
  todayBestItem: String = '';
  revenueTrend: RevenueTrend[] = [];
  topProducts: TopProducts[] = [];

  burger: Burger[] = [];
  sweet: Sweet[] = [];
  beverage: Beverage[] = [];
  top10Products: any[] = [];

  productName: String = '';
  quantity: number = 0;
  maxRevenue: number = 80000;;

  constructor(
    private statsService: StatsService,
    private burgerService: BurgersService,
    private beverageService: BeveragesService,
    private sweetService: SweetsService) { }

  ngOnInit(): void {
    this.loadData();
    this.loadAllData();
    this.setTopProduct();
  }

  loadData(): void {

    this.statsService.getTodayRevenue().subscribe({
      next: (data) => this.todayRevenue = data
    });

    this.statsService.getCustomer().subscribe({
      next: (data) => this.todayCutomer = data
    })

    this.statsService.getweeklyRevenue().subscribe({
      next: (data) => {
        this.revenueTrend = data;
        this.maxRevenue = Math.max(...data.map(item => item.revenue));
        console.log('Max revenue:', this.maxRevenue);
      }
    });

  }

  setTopProduct(): void {

    this.statsService.getTopProducts().subscribe({
      next: (data) => {

        if (data[0].itemType.toLowerCase() === 'burger') {
          const foundBurger = this.burger.find(b => b.id === this.topProducts[0].itemId);
          if (foundBurger) {
            this.productName = foundBurger.title;
            this.quantity = data[0].quantity;
            console.log(this.productName);
          }

        } else if (data[0].itemType.toLowerCase() === 'beverage') {
          const foundBeverage = this.beverage.find(b => b.id === this.topProducts[0].itemId);
          if (foundBeverage) {
            this.productName = foundBeverage.title;
            this.quantity = data[0].quantity;
            console.log(this.productName);
          }

        } else if (data[0].itemType.toLowerCase() === 'sweet') {
          const foundSweet = this.sweet.find(s => s.id === this.topProducts[0].itemId);
          if (foundSweet) {
            this.productName = foundSweet.title;
            this.quantity = data[0].quantity;
            console.log(this.productName);
          }
        }
      }
    })
  }

  loadAllData(): void {
    
    forkJoin({
      topProducts: this.statsService.getTopProducts(),
      burgers: this.burgerService.getAll(),
      beverages: this.beverageService.getAll(),
      sweets: this.sweetService.getAll()
    }).subscribe({
      next: (result) => {
        this.topProducts = result.topProducts;
        this.burger = result.burgers;
        this.beverage = result.beverages;
        this.sweet = result.sweets;

        this.generateTop10Products();
      }
    });
  }

  generateTop10Products(): void {

    this.top10Products = [];

    const topProductIds = this.topProducts.slice(0, 10);

    topProductIds.forEach(topProduct => {
      const itemType = topProduct.itemType?.toLowerCase();
      const itemId = topProduct.itemId;

      let productDetails = null;

      if (itemType === 'burger') {
        productDetails = this.burger.find(b => b.id === itemId);
      } else if (itemType === 'beverage') {
        productDetails = this.beverage.find(b => b.id === itemId);
      } else if (itemType === 'sweet') {
        productDetails = this.sweet.find(s => s.id === itemId);
      }

      if (productDetails) {
        this.top10Products.push({
          name: productDetails.title,
          type: itemType,
          count: topProduct.quantity
        });
      }
    });
  }

  // percentages calculate කරන function එක
  calculatePercentages(): void {
    if (!this.revenueTrend || this.revenueTrend.length === 0) {
      return;
    }

    this.maxRevenue = Math.max(...this.revenueTrend.map(item => item.revenue));

    this.revenueTrend = this.revenueTrend.map(item => {
      const percentage = (item.revenue / this.maxRevenue) * 100;
      return {
        ...item,
        percentage: Math.round(percentage * 10) / 10 // 1 decimal place
      };
    });

  }

  getBarHeight(percentage: number | undefined): string {
    if (!percentage) return '0%';
    return percentage + '%';
  }

  // Helper method - day name එක format කරන්න
  formatDay(date: string, index: number): string {
    if (!date) return `Day ${index + 1}`;

    try {
      const d = new Date(date);
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return days[d.getDay()] + ' ' + d.getDate();
    } catch (e) {
      return `Day ${index + 1}`;
    }
  }



  //-------------For pass more queries at once --------------------
  // forkJoin({
  //     revenue: this.statsService.getTodayRevenue(),
  //     customer: this.statsService.getTodayCustomer(),
  //     trend: this.statsService.getRevenueTrend()
  // }).subscribe({
  //     next: (result) => {
  //         this.todayRevenue = result.revenue;
  //         this.todayCustomer = result.customer;
  //         this.revenueTrend = result.trend;
  //         this.isLoading = false;
  //     },
  //     error: (err) => {
  //         this.error = 'දත්ත ගන්න බැරි උනා';
  //         this.isLoading = false;
  //     }
  // });

}


