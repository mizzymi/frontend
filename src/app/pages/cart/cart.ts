import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

import { CartService } from '../../core/services/cart';
import { CartItem } from '../../models/cart-item.model';

@Component({
  selector: 'app-cart',
  imports: [NgIf, NgFor, CurrencyPipe, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class Cart implements OnInit {
  items: CartItem[] = [];
  total = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.cartService.cart$.subscribe(items => {
      this.items = items;
      this.total = this.cartService.getTotal();
    });
  }

  updateQuantity(item: CartItem, event: Event): void {
    const quantity = Number((event.target as HTMLInputElement).value);

    this.cartService.updateQuantity(
      item.product._id,
      quantity,
      item.color,
      item.size
    );
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(
      item.product._id,
      item.color,
      item.size
    );
  }

  clearCart(): void {
    this.cartService.clearCart();
  }
}