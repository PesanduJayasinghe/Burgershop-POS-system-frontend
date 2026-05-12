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

  save(item: Beverage): Observable<Beverage> {
    return this.http.post<Beverage>(`http://localhost:8080/beverages/save`, item);
  }

  update(id: number, item: Beverage): Observable<Beverage> {
    return this.http.put<Beverage>(`http://localhost:8080/beverages/update/${id}`, item);
  }
}
