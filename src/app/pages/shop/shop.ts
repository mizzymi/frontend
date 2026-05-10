import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProductService } from '../../core/services/product';
import { Product } from '../../models/product.model';
import { ProductCard } from '../../shared/product-card/product-card';

@Component({
  selector: 'app-shop',
  imports: [NgFor, NgIf, FormsModule, ProductCard],
  templateUrl: './shop.html',
  styleUrl: './shop.scss'
})
export class Shop implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];

  loading = true;
  searchTerm = '';

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: products => {
        this.products = products;
        this.filteredProducts = products;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  filterProducts(): void {
    const term = this.searchTerm.toLowerCase().trim();

    if (!term) {
      this.filteredProducts = this.products;
      return;
    }

    this.filteredProducts = this.products.filter(product => {
      const categoryText = Array.isArray(product.category)
        ? product.category.join(' ')
        : product.category || '';

      const colorsText = Array.isArray(product.colors)
        ? product.colors.join(' ')
        : product.colors || '';

      const sizesText = Array.isArray(product.sizes)
        ? product.sizes.join(' ')
        : product.sizes || '';

      const searchableText = `
        ${product.name || ''}
        ${product.slug || ''}
        ${product.description || ''}
        ${categoryText}
        ${colorsText}
        ${sizesText}
      `.toLowerCase();

      return searchableText.includes(term);
    });
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredProducts = this.products;
  }
}