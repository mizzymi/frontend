import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../../core/services/admin';

@Component({
  selector: 'app-admin-login',
  imports: [NgIf, FormsModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.scss'
})
export class AdminLogin {
  email = '';
  password = '';
  loading = false;
  errorMessage = '';

  constructor(
    private adminService: AdminService,
    private router: Router
  ) { }

  login(): void {
    this.loading = true;
    this.errorMessage = '';

    this.adminService.login(this.email, this.password).subscribe({
      next: res => {
        localStorage.setItem('adminToken', res.token);
        this.router.navigate(['/admin']);
      },
      error: err => {
        this.errorMessage =
          err.error?.message || 'Credenciales incorrectas';
        this.loading = false;
      }
    });
  }
}