import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { UserService } from '../../../core/services/user';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-profile',
  imports: [NgIf, NgFor, FormsModule, CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  user: any = null;
  orders: any[] = [];
  savedProducts: any[] = [];
  reviews: any[] = [];

  loading = true;
  errorMessage = '';
  selectedImage?: File;

  editForm = {
    name: '',
    username: '',
    email: '',
  };

  addressForm = {
    fullName: '',
    phone: '',
    street: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'España',
    isDefault: false,
  };

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;

    this.userService.getProfile().subscribe({
      next: (user) => {
        this.user = user;

        this.editForm = {
          name: user.name || '',
          username: user.username || '',
          email: user.email || '',
        };

        this.loadExtraData();
      },
      error: () => {
        this.errorMessage = 'No se pudo cargar tu perfil.';
        this.loading = false;
      },
    });
  }

  loadExtraData(): void {
    this.userService.getSavedProducts().subscribe({
      next: (res) => (this.savedProducts = res || []),
    });

    this.userService.getMyReviews().subscribe({
      next: (res) => (this.reviews = res || []),
    });

    this.userService.getMyOrders().subscribe({
      next: (res) => {
        this.orders = res || [];
        this.loading = false;
      },
      error: () => {
        this.orders = [];
        this.loading = false;
      },
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    this.selectedImage = input.files[0];
  }

  saveProfile(): void {
    const data = new FormData();

    data.append('name', this.editForm.name);
    data.append('username', this.editForm.username);
    data.append('email', this.editForm.email);

    if (this.selectedImage) {
      data.append('profileImage', this.selectedImage);
    }

    this.userService.editProfile(data).subscribe({
      next: (res) => {
        this.user = res.user;
        localStorage.setItem('user', JSON.stringify(res.user));
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error editando perfil.';
      },
    });
  }

  addAddress(): void {
    this.errorMessage = '';

    if (
      !this.addressForm.fullName ||
      !this.addressForm.phone ||
      !this.addressForm.street ||
      !this.addressForm.city ||
      !this.addressForm.province ||
      !this.addressForm.postalCode ||
      !this.addressForm.country
    ) {
      this.errorMessage = 'Completa todos los campos de dirección.';
      return;
    }

    this.userService.addShippingAddress(this.addressForm).subscribe({
      next: (res) => {
        this.user.shippingAddresses = res.shippingAddresses || [];

        this.addressForm = {
          fullName: '',
          phone: '',
          street: '',
          city: '',
          province: '',
          postalCode: '',
          country: 'España',
          isDefault: false,
        };
      },

      error: (err) => {
        this.errorMessage = err.error?.message || 'Error añadiendo dirección.';
      },
    });
  }

  payPending(order: any) {
    window.location.href = `https://checkout.sumup.com/pay/${order.sumupCheckoutId}`;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
