import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Product } from '../../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://api.reimii.com/api/products';

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }
}