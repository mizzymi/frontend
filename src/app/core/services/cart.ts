import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Product } from '../../models/product.model';
import { CartItem } from '../../models/cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private storageKey = 'reimii_cart';
  private cartSubject = new BehaviorSubject<CartItem[]>(this.getCartFromStorage());

  cart$ = this.cartSubject.asObservable();

  addToCart(
    product: Product,
    quantity = 1,
    color?: string,
    size?: string,
    customText?: string
  ): void {
    const cart = [...this.cartSubject.value];

    const existingItem = cart.find(
      item =>
        item.product._id === product._id &&
        item.color === color &&
        item.size === size &&
        item.customText === customText
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        product,
        quantity,
        color,
        size,
        customText
      });
    }

    this.updateCart(cart);
  }

  removeFromCart(
    productId: string,
    color?: string,
    size?: string,
    customText?: string
  ): void {
    const cart = this.cartSubject.value.filter(
      item =>
        !(
          item.product._id === productId &&
          item.color === color &&
          item.size === size &&
          item.customText === customText
        )
    );

    this.updateCart(cart);
  }

  updateQuantity(
    productId: string,
    quantity: number,
    color?: string,
    size?: string,
    customText?: string
  ): void {
    if (quantity <= 0) {
      this.removeFromCart(productId, color, size, customText);
      return;
    }

    const cart = [...this.cartSubject.value];

    const item = cart.find(
      item =>
        item.product._id === productId &&
        item.color === color &&
        item.size === size &&
        item.customText === customText
    );

    if (!item) return;

    item.quantity = quantity;

    this.updateCart(cart);
  }

  clearCart(): void {
    this.updateCart([]);
  }

  getTotal(): number {
    return this.cartSubject.value.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }

  private updateCart(cart: CartItem[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(cart));
    this.cartSubject.next(cart);
  }

  private getCartFromStorage(): CartItem[] {
    const cart = localStorage.getItem(this.storageKey);
    return cart ? JSON.parse(cart) : [];
  }
}