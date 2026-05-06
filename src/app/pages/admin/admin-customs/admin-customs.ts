import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, CurrencyPipe, DatePipe } from '@angular/common';
import { AdminService } from '../../../core/services/admin';

@Component({
  selector: 'app-admin-customs',
  imports: [NgFor, NgIf, CurrencyPipe, DatePipe],
  templateUrl: './admin-customs.html',
  styleUrl: './admin-customs.scss'
})
export class AdminCustoms implements OnInit {
  customs: any[] = [];
  loading = true;

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.adminService.getCustomRequests().subscribe({
      next: res => {
        this.customs = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}