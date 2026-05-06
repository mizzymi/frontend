import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProductService } from '../../core/services/product';
import { CartService } from '../../core/services/cart';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail',
  imports: [NgIf, NgFor, CurrencyPipe, FormsModule, RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss'
})
export class ProductDetail implements OnInit {
  product?: Product;
  loading = true;
  error = '';

  selectedImage = '';
  selectedColor = '';
  selectedSize = '';
  quantity = 1;
  added = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error = 'Producto no encontrado.';
      this.loading = false;
      return;
    }

    this.productService.getProductById(id).subscribe({
      next: product => {
        this.product = product;
        this.selectedImage = product.images?.[0] || '';
        this.selectedColor = product.colors?.[0] || '';
        this.selectedSize = product.sizes?.[0] || '';
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudo cargar el producto.';
        this.loading = false;
      }
    });
  }

  addToCart(): void {
    if (!this.product) return;

    this.cartService.addToCart(
      this.product,
      this.quantity,
      this.selectedColor,
      this.selectedSize
    );

    this.added = true;
    setTimeout(() => this.added = false, 1800);
  }
}