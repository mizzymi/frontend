import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ProductService } from '../../core/services/product';
import { Product } from '../../models/product.model';
import { ProductCard } from '../../shared/product-card/product-card';

@Component({
  selector: 'app-home',
  imports: [NgIf, NgFor, RouterLink, ProductCard],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
  featuredProducts: Product[] = [];
  loading = true;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: products => {
        this.featuredProducts = products.filter(p => p.featured).slice(0, 4);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}