import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Product } from '../../models/product.model';
import { CartItem } from '../../models/cart-item.model';

@Injectable({
  providedIn: 'root',
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
    customText?: string,
    modifiers: any[] = [],
    customerModifierImages: any = {},
  ): void {
    const cart = [...this.cartSubject.value];

    const customerImages = Object.keys(customerModifierImages).map((key) => ({
      key,
      file: customerModifierImages[key],
    }));

    cart.push({
      product,
      quantity,
      color,
      size,
      customText,
      modifiers,
      customerImages,
    });

    this.updateCart(cart);
  }

  removeFromCart(
    productId: string,
    color?: string,
    size?: string,
    customText?: string,
    modifiers: any[] = [],
  ): void {
    const modifiersKey = JSON.stringify(modifiers || []);

    const cart = this.cartSubject.value.filter(
      (item) =>
        !(
          item.product._id === productId &&
          item.color === color &&
          item.size === size &&
          item.customText === customText &&
          JSON.stringify(item.modifiers || []) === modifiersKey
        ),
    );

    this.updateCart(cart);
  }

  updateQuantity(
    productId: string,
    quantity: number,
    color?: string,
    size?: string,
    customText?: string,
    modifiers: any[] = [],
  ): void {
    if (quantity <= 0) {
      this.removeFromCart(productId, color, size, customText, modifiers);
      return;
    }

    const modifiersKey = JSON.stringify(modifiers || []);

    const cart = [...this.cartSubject.value];

    const item = cart.find(
      (item) =>
        item.product._id === productId &&
        item.color === color &&
        item.size === size &&
        item.customText === customText &&
        JSON.stringify(item.modifiers || []) === modifiersKey,
    );

    if (!item) return;

    item.quantity = quantity;

    this.updateCart(cart);
  }

  clearCart(): void {
    this.updateCart([]);
  }

  getItemModifiersTotal(item: CartItem): number {
    if (!item.product.modifiers?.length || !item.modifiers?.length) return 0;

    let total = 0;

    item.modifiers.forEach((selectedModifier: any) => {
      const productModifier = item.product.modifiers?.find(
        (modifier: any) => modifier.id === selectedModifier.id,
      );

      if (!productModifier) return;

      selectedModifier.options?.forEach((selectedOption: any) => {
        const productOption = productModifier.options.find(
          (option: any) => option.id === selectedOption.id,
        );

        if (productOption) {
          total += Number(productOption.price || 0);
        }
      });
    });

    return total;
  }

  getItemUnitPrice(item: CartItem): number {
    return item.product.price + this.getItemModifiersTotal(item);
  }

  getItemSubtotal(item: CartItem): number {
    return this.getItemUnitPrice(item) * item.quantity;
  }

  getTotal(): number {
    return this.cartSubject.value.reduce((sum, item) => sum + this.getItemSubtotal(item), 0);
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
