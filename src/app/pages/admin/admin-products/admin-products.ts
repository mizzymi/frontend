import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminService } from '../../../core/services/admin';

@Component({
  selector: 'app-admin-products',
  imports: [NgFor, NgIf, FormsModule, CurrencyPipe],
  templateUrl: './admin-products.html',
  styleUrl: './admin-products.scss'
})
export class AdminProducts implements OnInit {
  products: any[] = [];

  loading = true;
  errorMessage = '';

  selectedImages: File[] = [];

  editingProduct: any = null;
  editImages: string[] = [];
  newEditImages: File[] = [];

  formData = {
    name: '',
    slug: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    colors: '',
    sizes: '',
    customizable: false,
    featured: false
  };

  editForm = {
    name: '',
    slug: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    colors: '',
    sizes: '',
    customizable: false,
    featured: false
  };

  constructor(private adminService: AdminService) { }

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
        this.errorMessage = 'Error cargando productos';
        this.loading = false;
      }
    });
  }

  onImagesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files) return;

    this.selectedImages = Array.from(input.files);
  }

  onEditImagesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files) return;

    this.newEditImages = Array.from(input.files);
  }

  removeEditImage(index: number): void {
    this.editImages.splice(index, 1);
  }

  moveImageUp(index: number): void {
    if (index === 0) return;

    const temp = this.editImages[index - 1];
    this.editImages[index - 1] = this.editImages[index];
    this.editImages[index] = temp;
  }

  moveImageDown(index: number): void {
    if (index === this.editImages.length - 1) return;

    const temp = this.editImages[index + 1];
    this.editImages[index + 1] = this.editImages[index];
    this.editImages[index] = temp;
  }

  private toArray(value: string): string[] {
    return value
      .split(',')
      .map(v => v.trim())
      .filter(Boolean);
  }

  createProduct(): void {
    this.errorMessage = '';

    const data = new FormData();

    data.append('name', this.formData.name);
    data.append('slug', this.formData.slug);
    data.append('description', this.formData.description);
    data.append('price', String(Number(this.formData.price)));
    data.append('stock', String(Number(this.formData.stock)));
    data.append('category', this.formData.category);

    data.append('colors', JSON.stringify(this.toArray(this.formData.colors)));
    data.append('sizes', JSON.stringify(this.toArray(this.formData.sizes)));

    data.append('customizable', String(this.formData.customizable));
    data.append('featured', String(this.formData.featured));

    this.selectedImages.forEach(file => {
      data.append('images', file);
    });

    this.adminService.createProduct(data).subscribe({
      next: () => {
        this.formData = {
          name: '',
          slug: '',
          description: '',
          price: '',
          stock: '',
          category: '',
          colors: '',
          sizes: '',
          customizable: false,
          featured: false
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
    this.editImages = [...(product.images || [])];
    this.newEditImages = [];

    this.editForm = {
      name: product.name || '',
      slug: product.slug || '',
      description: product.description || '',
      price: String(product.price ?? ''),
      stock: String(product.stock ?? ''),
      category: product.category || '',
      colors: product.colors?.join(', ') || '',
      sizes: product.sizes?.join(', ') || '',
      customizable: !!product.customizable,
      featured: !!product.featured
    };
  }

  cancelEdit(): void {
    this.editingProduct = null;
    this.editImages = [];
    this.newEditImages = [];
  }

  saveEdit(): void {
    if (!this.editingProduct) return;

    this.errorMessage = '';

    const data = new FormData();

    data.append('name', this.editForm.name);
    data.append('slug', this.editForm.slug);
    data.append('description', this.editForm.description);
    data.append('price', String(Number(this.editForm.price)));
    data.append('stock', String(Number(this.editForm.stock)));
    data.append('category', this.editForm.category);

    data.append('colors', JSON.stringify(this.toArray(this.editForm.colors)));
    data.append('sizes', JSON.stringify(this.toArray(this.editForm.sizes)));

    data.append('customizable', String(this.editForm.customizable));
    data.append('featured', String(this.editForm.featured));

    data.append('existingImages', JSON.stringify(this.editImages));

    this.newEditImages.forEach(file => {
      data.append('images', file);
    });

    this.adminService.updateProduct(
      this.editingProduct._id,
      data
    ).subscribe({
      next: () => {
        this.editingProduct = null;
        this.editImages = [];
        this.newEditImages = [];
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
    const confirmed = confirm(`¿Eliminar "${product.name}"?`);

    if (!confirmed) return;

    this.adminService.deleteProduct(product._id).subscribe({
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