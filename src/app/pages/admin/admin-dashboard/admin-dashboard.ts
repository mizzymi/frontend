import { Component, OnInit } from '@angular/core';
import { NgIf, CurrencyPipe } from '@angular/common';
import { forkJoin } from 'rxjs';

import { AdminService } from '../../../core/services/admin';

@Component({
  selector: 'app-admin-dashboard',
  imports: [NgIf, CurrencyPipe],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})
export class AdminDashboard implements OnInit {

  loading = true;

  stats = {
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

    forkJoin({
      products: this.adminService.getProducts(),
      orders: this.adminService.getOrders(),
      customs: this.adminService.getCustomRequests()
    }).subscribe({
      next: res => {

        this.stats.products = res.products.length;

        this.stats.orders = res.orders.length;

        this.stats.customs = res.customs.length;

        this.stats.revenue = res.orders.reduce(
          (acc: number, order: any) =>
            acc + (order.total || 0),
          0
        );

        this.latestOrder =
          res.orders?.[0] || null;

        this.latestCustom =
          res.customs?.[0] || null;

        this.loading = false;
      },

      error: err => {

        console.error(err);

        this.loading = false;
      }
    });
  }
}