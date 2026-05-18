import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Sweet } from '../../model/sweet.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SweetsService {

   private url: any = `http://localhost:8080/sweets/get`

  constructor(private http : HttpClient) { }

   getAll(): Observable<Sweet[]> {
    return this.http.get<Sweet[]>(this.url);
  }

  getSweets() {
    return this.getAll();
  }

  save(item: Sweet): Observable<Sweet> {
    return this.http.post<Sweet>(`http://localhost:8080/sweets/save`, item);
  }

  update(id: number, item: Sweet): Observable<Sweet> {
    return this.http.put<Sweet>(`http://localhost:8080/sweets/update/${id}`, item);
  }
}
