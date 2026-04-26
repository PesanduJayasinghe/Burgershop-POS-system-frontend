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
        this.calculatePercentages();
      }
    });

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

        this.setTopProduct();
        this.generateTop10Products();
      }
    });
  }

  setTopProduct(): void {
    if (!this.topProducts.length) {
      this.productName = 'No item';
      this.quantity = 0;
      return;
    }

    const topItem = this.topProducts[0];
    const itemType = topItem.itemType?.toLowerCase();

    if (itemType === 'burger') {
      const foundBurger = this.burger.find(b => b.id === topItem.itemId);
      if (foundBurger) {
        this.productName = foundBurger.title;
        this.quantity = topItem.quantity;
      }
      return;
    }

    if (itemType === 'beverage') {
      const foundBeverage = this.beverage.find(b => b.id === topItem.itemId);
      if (foundBeverage) {
        this.productName = foundBeverage.title;
        this.quantity = topItem.quantity;
      }
      return;
    }

    const foundSweet = this.sweet.find(s => s.id === topItem.itemId);
    if (foundSweet) {
      this.productName = foundSweet.title;
      this.quantity = topItem.quantity;
    }
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
      const percentage = this.maxRevenue === 0 ? 0 : (item.revenue / this.maxRevenue) * 100;
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

  getPointX(index: number): number {
    if (!this.revenueTrend || this.revenueTrend.length === 0) return 0;
    const spacing = (780 - 80) / Math.max(this.revenueTrend.length - 1, 1);
    return 40 + index * spacing;
  }

  getPointY(revenue: number): number {
    if (this.maxRevenue === 0) return 195;
    const percentage = (revenue / this.maxRevenue) * 100;
    return 195 - (percentage / 100) * 165;
  }

  getLinePath(): string {
    if (!this.revenueTrend || this.revenueTrend.length === 0) return '';
    return this.revenueTrend
      .map((item, idx) => `${this.getPointX(idx)},${this.getPointY(item.revenue)}`)
      .join(' ');
  }

  getAreaPath(): string {
    if (!this.revenueTrend || this.revenueTrend.length === 0) return '';
    const linePoints = this.revenueTrend
      .map((item, idx) => `${this.getPointX(idx)},${this.getPointY(item.revenue)}`)
      .join(' ');
    const lastX = this.getPointX(this.revenueTrend.length - 1);
    const firstX = this.getPointX(0);
    return `${firstX},195 ${linePoints} ${lastX},195`;
  }

  getChartPath(): string {
    return this.getLinePath();
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


