import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { CartService } from '../../core/services/cart';
import { PaymentService } from '../../core/services/payment';
import { CartItem } from '../../models/cart-item.model';
import { ShippingAddress } from '../../models/shipping-address.model';

@Component({
  selector: 'app-checkout',
  imports: [NgIf, NgFor, CurrencyPipe, FormsModule, RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss'
})
export class Checkout implements OnInit {
  items: CartItem[] = [];
  total = 0;

  customerName = '';
  email = '';
  phone = '';

  shippingAddress: ShippingAddress = {
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'España'
  };

  loading = false;
  error = '';

  constructor(
    private cartService: CartService,
    private paymentService: PaymentService
  ) { }

  ngOnInit(): void {
    this.cartService.cart$.subscribe(items => {
      this.items = items;
      this.total = this.cartService.getTotal();
    });
  }

  calculateShipping(): number {
    if (this.total >= 60) return 0;

    const country = this.shippingAddress.country.trim().toLowerCase();

    if (country === 'españa' || country === 'spain') {
      return 4.99;
    }

    return 12.99;
  }

  getFinalTotal(): number {
    return this.total + this.calculateShipping();
  }

  pay(): void {
    this.error = '';

    if (!this.customerName || !this.email) {
      this.error = 'Nombre y email son obligatorios.';
      return;
    }

    if (
      !this.shippingAddress.fullName ||
      !this.shippingAddress.addressLine1 ||
      !this.shippingAddress.city ||
      !this.shippingAddress.province ||
      !this.shippingAddress.postalCode ||
      !this.shippingAddress.country
    ) {
      this.error = 'La dirección de envío es obligatoria.';
      return;
    }

    if (this.items.length === 0) {
      this.error = 'El carrito está vacío.';
      return;
    }

    this.loading = true;

    this.paymentService.createCheckoutSession({
      customerName: this.customerName,
      email: this.email,
      phone: this.phone,
      shippingAddress: this.shippingAddress,
      items: this.items
    }).subscribe({
      next: (res: any) => {
        console.log('Respuesta checkout:', res);

        if (res.url) {
          window.location.href = res.url;
          return;
        }

        if (res.redirectUrl) {
          window.location.href = res.redirectUrl;
          return;
        }

        this.error = 'No se recibió URL de redirección.';
        this.loading = false;
      },
      error: err => {
        this.error = err.error?.message || 'Error al iniciar pago.';
        this.loading = false;
      }
    });
  }
}