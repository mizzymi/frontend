import { Component, OnInit } from '@angular/core';
import { NgIf, CurrencyPipe } from '@angular/common';

import { AdminService } from '../../../core/services/admin';

@Component({
  selector: 'app-admin-dashboard',
  imports: [NgIf, CurrencyPipe],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})
export class AdminDashboard implements OnInit {
  loading = true;
  errorMessage = '';

  stats: any = {
    products: 0,
    orders: 0,
    customs: 0,
    revenue: 0
  };

  latestOrder: any = null;
  latestCustom: any = null;

  constructor(
    private adminService: AdminService
  ) { }

  ngOnInit(): void {
    this.adminService.getStats().subscribe({
      next: res => {
        this.stats = res.stats;

        this.latestOrder = res.latestOrder;

        this.latestCustom = res.latestCustom;

        this.loading = false;
      },

      error: err => {
        console.error(err);

        this.errorMessage =
          err.error?.message ||
          'Error cargando dashboard';

        this.loading = false;
      }
    });
  }
}