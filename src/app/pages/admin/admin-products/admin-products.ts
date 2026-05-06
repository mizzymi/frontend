import { Component, OnInit } from '@angular/core';
import {
  NgFor,
  NgIf,
  CurrencyPipe
} from '@angular/common';

import { FormsModule } from '@angular/forms';

import { AdminService } from '../../../core/services/admin';

@Component({
  selector: 'app-admin-products',
  imports: [
    NgFor,
    NgIf,
    FormsModule,
    CurrencyPipe
  ],
  templateUrl: './admin-products.html',
  styleUrl: './admin-products.scss'
})
export class AdminProducts implements OnInit {

  products: any[] = [];

  loading = true;

  errorMessage = '';

  selectedImages: File[] = [];

  editingProduct: any = null;

  formData = {
    name: '',
    description: '',
    price: '',
    stock: '',
    category: ''
  };

  editForm = {
    name: '',
    description: '',
    price: '',
    stock: '',
    category: ''
  };

  constructor(
    private adminService: AdminService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {

    this.loading = true;

    this.adminService.getProducts().subscribe({
      next: res => {

        this.products = res;

        this.loading = false;
      },

      error: err => {

        console.error(err);

        this.errorMessage =
          'Error cargando productos';

        this.loading = false;
      }
    });
  }

  onImagesSelected(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    if (!input.files) return;

    this.selectedImages =
      Array.from(input.files);
  }

  createProduct(): void {

    const data = new FormData();

    Object.entries(this.formData)
      .forEach(([key, value]) => {

        if (value) {
          data.append(key, value);
        }
      });

    this.selectedImages.forEach(file => {
      data.append('images', file);
    });

    this.adminService
      .createProduct(data)
      .subscribe({

        next: () => {

          this.formData = {
            name: '',
            description: '',
            price: '',
            stock: '',
            category: ''
          };

          this.selectedImages = [];

          this.loadProducts();
        },

        error: err => {

          console.error(err);

          this.errorMessage =
            err.error?.message ||
            'Error creando producto';
        }
      });
  }

  startEdit(product: any): void {

    this.editingProduct = product;

    this.editForm = {
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      stock: product.stock || '',
      category: product.category || ''
    };
  }

  cancelEdit(): void {
    this.editingProduct = null;
  }

  saveEdit(): void {

    if (!this.editingProduct) return;

    this.adminService.updateProduct(
      this.editingProduct._id,
      this.editForm
    ).subscribe({

      next: () => {

        this.editingProduct = null;

        this.loadProducts();
      },

      error: err => {

        console.error(err);

        this.errorMessage =
          err.error?.message ||
          'Error actualizando producto';
      }
    });
  }

  removeProduct(product: any): void {

    const confirmed = confirm(
      `¿Eliminar "${product.name}"?`
    );

    if (!confirmed) return;

    this.adminService.deleteProduct(
      product._id
    ).subscribe({

      next: () => {
        this.loadProducts();
      },

      error: err => {

        console.error(err);

        this.errorMessage =
          err.error?.message ||
          'Error eliminando producto';
      }
    });
  }
}