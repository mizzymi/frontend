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
                Authorization: `Bearer ${token}`
            })
        };
    }

    login(email: string, password: string) {
        return this.http.post<any>(`${this.apiUrl}/auth/admin/login`, {
            email,
            password
        });
    }

    getProducts() {
        return this.http.get<any[]>(`${this.apiUrl}/products`);
    }

    createProduct(data: FormData) {
        return this.http.post(
            `${this.apiUrl}/products/`,
            data,
            this.getHeaders()
        );
    }

    updateProduct(id: string, data: any) {
        return this.http.put(
            `${this.apiUrl}/products/${id}`,
            data,
            this.getHeaders()
        );
    }

    deleteProduct(id: string) {
        return this.http.delete(
            `${this.apiUrl}/products/${id}`,
            this.getHeaders()
        );
    }

    getOrders() {
        return this.http.get<any[]>(
            `${this.apiUrl}/orders`,
            this.getHeaders()
        );
    }

    getCustomRequests() {
        return this.http.get<any[]>(
            `${this.apiUrl}/custom-requests`,
            this.getHeaders()
        );
    }
}