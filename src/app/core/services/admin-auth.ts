import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AdminAuthService {
    private apiUrl = 'https://api.reimii.com/api/admin';

    constructor(private http: HttpClient) { }

    login(email: string, password: string) {
        return this.http.post<any>(`${this.apiUrl}/login`, {
            email,
            password
        });
    }

    saveSession(res: any) {
        localStorage.setItem('adminToken', res.token);
        localStorage.setItem('admin', JSON.stringify(res.admin));
    }

    logout() {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('admin');
    }

    isLoggedIn() {
        return !!localStorage.getItem('adminToken');
    }

    getAdmin() {
        const admin = localStorage.getItem('admin');
        return admin ? JSON.parse(admin) : null;
    }
}