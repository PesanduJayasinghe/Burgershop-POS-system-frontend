import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Burger } from '../../model/burger.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BurgersService {

  private url: any = `http://localhost:8080/burgers/get`

  constructor(private http : HttpClient) { }

     getAll(): Observable<Burger[]> {
       return this.http.get<Burger[]>(this.url);
     }

     save(item: Burger): Observable<Burger> {
       return this.http.post<Burger>(`http://localhost:8080/burgers/save`, item);
     }

     update(id: number, item: Burger): Observable<Burger> {
       return this.http.put<Burger>(`http://localhost:8080/burgers/update/${id}`, item);
     }
}
