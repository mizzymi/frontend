import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'https://api.reimii.com/api/users';

    private userSubject = new BehaviorSubject<any>(this.getStoredUser());

    user$ = this.userSubject.asObservable();

    constructor(private http: HttpClient) { }

    register(data: FormData) {
        return this.http.post<any>(`${this.apiUrl}/register`, data);
    }

    login(email: string, password: string) {
        return this.http.post<any>(`${this.apiUrl}/login`, {
            email,
            password
        });
    }

    saveSession(res: any) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));

        this.userSubject.next(res.user);
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        this.userSubject.next(null);
    }

    isLoggedIn() {
        return !!localStorage.getItem('token');
    }

    getUser() {
        return this.userSubject.value;
    }

    private getStoredUser() {
        const user = localStorage.getItem('user');

        return user ? JSON.parse(user) : null;
    }
}