import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

import { ProductService } from '../../core/services/product';
import { Product } from '../../models/product.model';
import { ProductCard } from '../../shared/product-card/product-card';

@Component({
  selector: 'app-shop',
  imports: [NgFor, NgIf, ProductCard],
  templateUrl: './shop.html',
  styleUrl: './shop.scss'
})
export class Shop implements OnInit {
  products: Product[] = [];
  loading = true;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: products => {
        this.products = products;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}