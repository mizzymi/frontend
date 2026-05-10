import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CurrencyPipe, DecimalPipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProductService } from '../../core/services/product';
import { CartService } from '../../core/services/cart';
import { Product } from '../../models/product.model';
import { UserService } from '../../core/services/user';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-product-detail',
  imports: [
    NgIf,
    NgFor,
    CurrencyPipe,
    DecimalPipe,
    FormsModule,
    RouterLink
  ],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss'
})

export class ProductDetail implements OnInit {
  product?: Product;
  loading = true;
  error = '';
  isSaved = false;
  customText = '';
  selectedImage = '';
  selectedImageIndex = 0;
  selectedColor = '';
  selectedSize = '';
  quantity = 1;
  added = false;
  imageModalOpen = false;
  private wheelLocked = false;
  touchStartX = 0;
  touchEndX = 0;
  reviewRating = 5;
  reviewComment = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private userService: UserService,
    public authService: AuthService,
    private router: Router
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
        this.selectedImageIndex = 0;
        this.selectedColor = product.colors?.[0] || '';
        this.selectedSize = product.sizes?.[0] || '';

        if (this.authService.isLoggedIn()) {
          this.userService.getSavedProducts().subscribe({
            next: savedProducts => {
              this.isSaved = savedProducts.some(
                (item: any) => item._id === product._id
              );
            },
            error: () => {
              this.isSaved = false;
            }
          });
        }

        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudo cargar el producto.';
        this.loading = false;
      }
    });
  }

  submitReview(): void {
    if (!this.product) return;

    if (!this.reviewComment.trim()) return;

    this.productService.addReview(
      this.product._id,
      {
        rating: this.reviewRating,
        comment: this.reviewComment
      }
    ).subscribe({
      next: (res: any) => {

        if (!this.product) return;

        this.product.reviews = res.reviews;

        this.product.ratingAverage =
          res.ratingAverage;

        this.product.ratingCount =
          res.ratingCount;

        this.reviewComment = '';
        this.reviewRating = 5;
      },

      error: err => {
        console.error(err);
      }
    });
  }

  toggleLike(): void {
    if (!this.product) return;

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.userService.toggleSavedProduct(this.product._id).subscribe({
      next: res => {
        this.isSaved = res.savedProducts.some(
          (item: any) => item._id === this.product?._id
        );
      }
    });
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  onTouchEnd(event: TouchEvent): void {
    this.touchEndX = event.changedTouches[0].screenX;

    const swipeDistance = this.touchStartX - this.touchEndX;

    // mínimo para detectar swipe
    if (Math.abs(swipeDistance) < 50) return;

    if (swipeDistance > 0) {
      // swipe izquierda
      this.nextImage();
    } else {
      // swipe derecha
      this.prevImage();
    }
  }

  selectImage(image: string, index: number): void {
    this.selectedImage = image;
    this.selectedImageIndex = index;
  }

  onImageWheel(event: WheelEvent): void {
    if (!this.product?.images?.length || this.product.images.length <= 1) return;

    event.preventDefault();

    if (this.wheelLocked) return;
    this.wheelLocked = true;

    if (event.deltaY > 0) {
      this.nextImage();
    } else {
      this.prevImage();
    }

    setTimeout(() => {
      this.wheelLocked = false;
    }, 350);
  }

  nextImage(): void {
    if (!this.product?.images?.length) return;

    this.selectedImageIndex =
      (this.selectedImageIndex + 1) % this.product.images.length;

    this.selectedImage = this.product.images[this.selectedImageIndex];
  }

  prevImage(): void {
    if (!this.product?.images?.length) return;

    this.selectedImageIndex =
      (this.selectedImageIndex - 1 + this.product.images.length) %
      this.product.images.length;

    this.selectedImage = this.product.images[this.selectedImageIndex];
  }

  openImageModal(): void {
    this.imageModalOpen = true;
  }

  closeImageModal(): void {
    this.imageModalOpen = false;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeImageModal();
  }

  @HostListener('document:keydown.arrowright')
  onArrowRight(): void {
    if (this.imageModalOpen) this.nextImage();
  }

  @HostListener('document:keydown.arrowleft')
  onArrowLeft(): void {
    if (this.imageModalOpen) this.prevImage();
  }

  addToCart(): void {
    if (!this.product) return;

    this.cartService.addToCart(
      this.product,
      this.quantity,
      this.selectedColor,
      this.selectedSize,
      this.customText
    );

    this.added = true;
    setTimeout(() => this.added = false, 1800);
  }
}