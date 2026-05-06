import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, CurrencyPipe } from '@angular/common';
import { AdminService } from '../../../core/services/admin';

@Component({
  selector: 'app-admin-orders',
  imports: [NgFor, NgIf, CurrencyPipe],
  templateUrl: './admin-orders.html',
  styleUrl: './admin-orders.scss'
})
export class AdminOrders implements OnInit {
  orders: any[] = [];
  loading = true;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.adminService.getOrders().subscribe({
      next: res => {
        this.orders = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}