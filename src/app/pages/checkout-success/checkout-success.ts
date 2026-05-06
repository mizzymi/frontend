import { Component, OnInit } from '@angular/core';
import { NgIf, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { PaymentService } from '../../core/services/payment';
import { CartService } from '../../core/services/cart';

@Component({
  selector: 'app-success',
  imports: [NgIf, CurrencyPipe, RouterLink],
  templateUrl: './checkout-success.html',
  styleUrl: './checkout-success.scss'
})
export class CheckoutSuccess implements OnInit {
  loading = true;
  session: any;
  order: any;

  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    const sessionId = this.route.snapshot.queryParamMap.get('session_id');

    if (!sessionId) {
      this.loading = false;
      return;
    }

    this.paymentService.getSessionResult(sessionId).subscribe({
      next: res => {
        this.session = res.session;
        this.order = res.order;

        if (
          this.session?.paymentStatus === 'paid' ||
          sessionId.startsWith('free_order_') ||
          this.order?.status === 'paid'
        ) {
          this.cartService.clearCart();
        }

        this.loading = false;
      },
      error: err => {
        console.error('Error success:', err);
        this.loading = false;
      }
    });
  }
}