import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = 'https://api.reimii.com/api/users';

    constructor(private http: HttpClient) { }

    private getHeaders() {
        const token = localStorage.getItem('token');

        return {
            headers: new HttpHeaders({
                Authorization: `Bearer ${token}`
            })
        };
    }

    getProfile() {
        return this.http.get<any>(`${this.apiUrl}/profile`, this.getHeaders());
    }

    editProfile(data: FormData) {
        return this.http.put<any>(
            `${this.apiUrl}/profile`,
            data,
            this.getHeaders()
        );
    }

    toggleSavedProduct(productId: string) {
        return this.http.post<any>(
            `${this.apiUrl}/saved/${productId}`,
            {},
            this.getHeaders()
        );
    }

    getSavedProducts() {
        return this.http.get<any[]>(
            `${this.apiUrl}/saved`,
            this.getHeaders()
        );
    }

    getMyReviews() {
        return this.http.get<any[]>(
            `${this.apiUrl}/reviews`,
            this.getHeaders()
        );
    }

    addToUserCart(productId: string, quantity: number) {
        return this.http.post<any>(
            `${this.apiUrl}/cart`,
            { productId, quantity },
            this.getHeaders()
        );
    }

    getUserCart() {
        return this.http.get<any[]>(
            `${this.apiUrl}/cart`,
            this.getHeaders()
        );
    }

    updateCartItem(productId: string, quantity: number) {
        return this.http.put<any>(
            `${this.apiUrl}/cart/${productId}`,
            { quantity },
            this.getHeaders()
        );
    }

    removeFromCart(productId: string) {
        return this.http.delete<any>(
            `${this.apiUrl}/cart/${productId}`,
            this.getHeaders()
        );
    }

    clearCart() {
        return this.http.delete<any>(
            `${this.apiUrl}/cart`,
            this.getHeaders()
        );
    }

    getMyOrders() {
        return this.http.get<any[]>(
            `https://api.reimii.com/api/orders/my-orders`,
            this.getHeaders()
        );
    }

    addShippingAddress(address: any) {
        return this.http.post<any>(
            `${this.apiUrl}/address`,
            address,
            this.getHeaders()
        );
    }
}