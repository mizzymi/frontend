import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { CartItem } from '../../models/cart-item.model';
import { ShippingAddress } from '../../models/shipping-address.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'https://api.reimii.com/api/payment';

  constructor(private http: HttpClient) { }

  private getHeaders() {
    const token = localStorage.getItem('token');

    if (!token) {
      return {};
    }

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  createCheckoutSession(data: {
    customerName: string;
    email: string;
    phone?: string;
    shippingAddress: ShippingAddress;
    items: CartItem[];
  }): Observable<any> {
    const payload = {
      customerName: data.customerName,
      email: data.email,
      phone: data.phone,
      shippingAddress: data.shippingAddress,
      items: data.items.map(item => ({
        productId: item.product._id,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
        customText: item.customText
      }))
    };

    return this.http.post<any>(
      `${this.apiUrl}/checkout`,
      payload,
      this.getHeaders()
    );
  }

  getSessionResult(sessionId: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/session/${sessionId}`
    );
  }
}