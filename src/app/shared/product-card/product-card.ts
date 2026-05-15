import { Component, Input } from '@angular/core';
import { CurrencyPipe, NgIf, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, NgIf, DecimalPipe, RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  @Input({ required: true }) product!: Product;

  formatReviews(count: number): string {
    if (count >= 1_000_000) {
      return `${this.cleanNumber(count / 1_000_000)}m`;
    }

    if (count >= 1_000) {
      return `${this.cleanNumber(count / 1_000)}k`;
    }

    return `${count}`;
  }

  private cleanNumber(value: number): string {
    return value % 1 === 0 ? value.toString() : value.toFixed(1);
  }
}
