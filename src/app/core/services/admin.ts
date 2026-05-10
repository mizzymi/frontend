import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private apiUrl = 'https://api.reimii.com/api';

    constructor(private http: HttpClient) { }

    private getHeaders() {
        const token = localStorage.getItem('adminToken');

        return {
            headers: new HttpHeaders({
                Authorization: `Bearer ${token || ''}`
            })
        };
    }

    getProducts() {
        return this.http.get<any[]>(`${this.apiUrl}/products`);
    }

    createProduct(data: FormData) {
        return this.http.post(`${this.apiUrl}/products`, data, this.getHeaders());
    }

    updateProduct(id: string, data: FormData) {
        return this.http.put(`${this.apiUrl}/products/${id}`, data, this.getHeaders());
    }

    deleteProduct(id: string) {
        return this.http.delete(`${this.apiUrl}/products/${id}`, this.getHeaders());
    }

    getOrders() {
        return this.http.get<any[]>(`${this.apiUrl}/orders`, this.getHeaders());
    }

    updateOrderStatus(orderId: string, status: string) {
        return this.http.put(
            `${this.apiUrl}/orders/${orderId}`,
            { status },
            this.getHeaders()
        );
    }

    getCustomRequests() {
        return this.http.get<any[]>(`${this.apiUrl}/custom-requests`, this.getHeaders());
    }

    deleteCustomRequest(id: string) {
        return this.http.delete(`${this.apiUrl}/custom-requests/${id}`, this.getHeaders());
    }

    getStats() {
        return this.http.get<any>(
            `${this.apiUrl}/admin/stats`,
            this.getHeaders()
        );
    }
}