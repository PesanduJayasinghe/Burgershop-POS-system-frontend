import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Beverage } from '../../model/beverage.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BeveragesService {

  private url: any = `http://localhost:8080/beverages/get`

  constructor(private http: HttpClient) { }

  getAll(): Observable<Beverage[]> {
    return this.http.get<Beverage[]>(this.url);
  }

  // getSweets() {
  //   return this.getAll();
  // }

}
