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

}
