import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

import { CartService } from '../../core/services/cart';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, NgIf],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  cartCount = 0;

  constructor(private cartService: CartService) {
    this.cartService.cart$.subscribe(items => {
      this.cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
    });
  }
}