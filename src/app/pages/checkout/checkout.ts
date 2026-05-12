import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { CartService } from '../../core/services/cart';
import { PaymentService } from '../../core/services/payment';
import { UserService } from '../../core/services/user';
import { AuthService } from '../../core/services/auth';

import { CartItem } from '../../models/cart-item.model';
import { ShippingAddress } from '../../models/shipping-address.model';

@Component({
  selector: 'app-checkout',
  imports: [NgIf, NgFor, CurrencyPipe, FormsModule, RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout implements OnInit {
  items: CartItem[] = [];
  total = 0;

  customerName = '';
  email = '';
  phone = '';

  user: any = null;

  savedAddresses: any[] = [];
  selectedAddressId = '';

  shippingAddress: ShippingAddress = {
    fullName: '',
    phone: '',
    street: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'España',
    isDefault: false,
  };

  loading = false;
  error = '';

  constructor(
    private cartService: CartService,
    private paymentService: PaymentService,
    private userService: UserService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe((items) => {
      this.items = items;
      this.total = this.cartService.getTotal();
    });

    this.loadUserData();
  }

  loadUserData(): void {
    if (!this.authService.isLoggedIn()) return;

    this.userService.getProfile().subscribe({
      next: (user) => {
        this.user = user;

        this.customerName = user.name || '';
        this.email = user.email || '';
        this.phone = user.phone || '';

        this.savedAddresses = user.shippingAddresses || [];

        const defaultAddress =
          this.savedAddresses.find((address: any) => address.isDefault) || this.savedAddresses[0];

        if (defaultAddress) {
          this.selectedAddressId = defaultAddress._id || '';

          this.applySavedAddress(defaultAddress);
        }
      },

      error: (err) => {
        console.error(err);
      },
    });
  }

  applySavedAddress(address: any): void {
    this.shippingAddress = {
      fullName: address.fullName || '',
      phone: address.phone || '',
      street: address.street || '',
      city: address.city || '',
      province: address.province || '',
      postalCode: address.postalCode || '',
      country: address.country || 'España',
      isDefault: !!address.isDefault,
    };

    this.phone = address.phone || this.phone || '';
  }

  onSavedAddressChange(): void {
    const address = this.savedAddresses.find((item) => item._id === this.selectedAddressId);

    if (address) {
      this.applySavedAddress(address);
    }
  }

  calculateShipping(): number {
    const normalizedCountry = this.shippingAddress.country.trim().toLowerCase();

    let totalWeight = 0;

    for (const item of this.items) {
      const quantity = Number(item.quantity || 1);
      const weight = Number(item.product?.weight || 0);

      totalWeight += weight * quantity;
    }

    const weightKg = totalWeight / 1000;

    const isSpain = normalizedCountry === 'españa' || normalizedCountry === 'spain';

    if (isSpain) {
      if (weightKg <= 0.5) return 5.99;
      if (weightKg <= 1) return 6.99;
      if (weightKg <= 2) return 8.99;
      if (weightKg <= 5) return 10.99;

      return 14.99;
    }

    if (weightKg <= 0.5) return 15.99;
    if (weightKg <= 1) return 16.99;
    if (weightKg <= 2) return 20.99;
    if (weightKg <= 5) return 28.99;

    return 39.99;
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
      !this.shippingAddress.phone ||
      !this.shippingAddress.street ||
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

    this.paymentService
      .createCheckoutSession({
        customerName: this.customerName,
        email: this.email,
        phone: this.phone,

        shippingAddress: this.shippingAddress,

        items: this.items,
      })
      .subscribe({
        next: (res: any) => {
          if (res.url) {
            window.location.href = res.url;
            return;
          }

          if (res.redirectUrl) {
            window.location.href = res.redirectUrl;

            return;
          }

          this.error = 'No se recibió URL de pago.';

          this.loading = false;
        },

        error: (err) => {
          this.error = err.error?.message || 'Error iniciando pago.';

          this.loading = false;
        },
      });
  }
}
