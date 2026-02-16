import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RevenueTrend } from '../../model/revenueTrend.model';
import { TopProducts } from '../../model/topProducts.model';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  //--order---
   private todayRevenueURL: string  = `http://localhost:8080/analytics/revenue`
   private todayCustomerURL: string =  `http://localhost:8080/analytics/customer`
   private weeklyRevenue: string =`http://localhost:8080/analytics/revenue-trend`

  //--order-detail---
  private topProducts: string =`http://localhost:8080/analytics/top-products`

  constructor(private http: HttpClient) { }

  getTodayRevenue():Observable<Number>{
      return this.http.get<number>(this.todayRevenueURL);
  }

  getCustomer():Observable<Number>{
      return this.http.get<number>(this.todayCustomerURL);
  }

  getweeklyRevenue():Observable<RevenueTrend[]>{
      return this.http.get<RevenueTrend[]>(this.weeklyRevenue);
  }

  getTopProducts():Observable<TopProducts[]>{
      return this.http.get<TopProducts[]>(this.topProducts);
  }

}
