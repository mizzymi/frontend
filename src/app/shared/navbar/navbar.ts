import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

import { CartService } from '../../core/services/cart';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, NgIf],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  cartCount = 0;
  menuOpen = false;
  user: any = null;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {
    this.cartService.cart$.subscribe(items => {
      this.cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
    });

    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  goToProfile(): void {
    this.closeMenu();

    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/profile']);
      return;
    }

    this.router.navigate(['/login']);
  }

  logout(): void {
    this.authService.logout();
    this.user = null;
    this.menuOpen = false;
    this.router.navigate(['/']);
  }
}