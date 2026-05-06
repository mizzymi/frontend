import { Component, Input } from '@angular/core';
import { CurrencyPipe, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, NgIf, RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss'
})
export class ProductCard {
  @Input({ required: true }) product!: Product;
}