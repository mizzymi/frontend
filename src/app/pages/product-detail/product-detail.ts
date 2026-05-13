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
  imports: [NgIf, NgFor, CurrencyPipe, DecimalPipe, FormsModule, RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
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
  selectedModifiers: any = {};
  quantity = 1;
  added = false;
  imageModalOpen = false;
  private wheelLocked = false;
  touchStartX = 0;
  touchEndX = 0;
  reviewRating = 5;
  reviewComment = '';
  customerModifierImages: any = {};

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private userService: UserService,
    public authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error = 'Producto no encontrado.';
      this.loading = false;
      return;
    }

    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.selectedImage = product.images?.[0] || '';
        this.selectedImageIndex = 0;
        this.selectedColor = product.colors?.[0] || '';
        this.selectedSize = product.sizes?.[0] || '';

        this.selectedModifiers = {};

        product.modifiers?.forEach((modifier: any) => {
          if (modifier.type === 'single') {
            this.selectedModifiers[modifier.id] = '';
          }

          if (modifier.type === 'multiple') {
            this.selectedModifiers[modifier.id] = [];
          }
        });

        if (this.authService.isLoggedIn()) {
          this.userService.getSavedProducts().subscribe({
            next: (savedProducts) => {
              this.isSaved = savedProducts.some((item: any) => item._id === product._id);
            },
            error: () => {
              this.isSaved = false;
            },
          });
        }

        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudo cargar el producto.';
        this.loading = false;
      },
    });
  }

  getImageKey(modifierId: string, optionId: string): string {
    return `${modifierId}_${optionId}`;
  }

  onCustomerModifierImageSelected(event: Event, modifierId: string, optionId: string): void {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    this.customerModifierImages[this.getImageKey(modifierId, optionId)] = input.files[0];
  }

  getCustomerImageFile(modifierId: string, optionId: string): File | null {
    return this.customerModifierImages[this.getImageKey(modifierId, optionId)] || null;
  }

  selectedOptionNeedsImage(modifier: any, option: any): boolean {
    if (!option.requiresCustomerImage) return false;

    if (modifier.type === 'single') {
      return this.selectedModifiers[modifier.id] === option.id;
    }

    if (modifier.type === 'multiple') {
      return this.selectedModifiers[modifier.id]?.includes(option.id);
    }

    return false;
  }

  toggleSingleModifierOption(modifierId: string, optionId: string): void {
    if (this.selectedModifiers[modifierId] === optionId) {
      this.selectedModifiers[modifierId] = '';
    } else {
      this.selectedModifiers[modifierId] = optionId;
    }
  }

  isSingleModifierOptionSelected(modifierId: string, optionId: string): boolean {
    return this.selectedModifiers[modifierId] === optionId;
  }

  getSelectedModifiersPayload(): any[] {
    if (!this.product?.modifiers?.length) return [];

    return this.product.modifiers
      .map((modifier: any) => {
        if (modifier.type === 'single') {
          const selectedOptionId = this.selectedModifiers[modifier.id];

          if (!selectedOptionId) return null;

          const option = modifier.options.find((option: any) => option.id === selectedOptionId);

          return {
            id: modifier.id,
            options: [
              {
                id: selectedOptionId,
                requiresCustomerImage: !!option?.requiresCustomerImage,
                customerImageKey: option?.requiresCustomerImage
                  ? this.getImageKey(modifier.id, selectedOptionId)
                  : undefined,
              },
            ],
          };
        }

        if (modifier.type === 'multiple') {
          const selectedOptionIds = this.selectedModifiers[modifier.id] || [];

          if (!selectedOptionIds.length) return null;

          return {
            id: modifier.id,
            options: selectedOptionIds.map((optionId: string) => {
              const option = modifier.options.find((option: any) => option.id === optionId);

              return {
                id: optionId,
                requiresCustomerImage: !!option?.requiresCustomerImage,
                customerImageKey: option?.requiresCustomerImage
                  ? this.getImageKey(modifier.id, optionId)
                  : undefined,
              };
            }),
          };
        }

        return null;
      })
      .filter(Boolean);
  }

  toggleModifierOption(modifierId: string, optionId: string): void {
    const selected = this.selectedModifiers[modifierId] || [];

    if (selected.includes(optionId)) {
      this.selectedModifiers[modifierId] = selected.filter((id: string) => id !== optionId);
    } else {
      this.selectedModifiers[modifierId] = [...selected, optionId];
    }
  }

  isModifierOptionSelected(modifierId: string, optionId: string): boolean {
    return this.selectedModifiers[modifierId]?.includes(optionId);
  }

  getModifiersTotal(): number {
    if (!this.product?.modifiers?.length) return 0;

    let total = 0;

    this.product.modifiers.forEach((modifier: any) => {
      if (modifier.type === 'single') {
        const selectedOptionId = this.selectedModifiers[modifier.id];

        const option = modifier.options.find((option: any) => option.id === selectedOptionId);

        if (option) total += Number(option.price || 0);
      }

      if (modifier.type === 'multiple') {
        const selectedOptionIds = this.selectedModifiers[modifier.id] || [];

        modifier.options.forEach((option: any) => {
          if (selectedOptionIds.includes(option.id)) {
            total += Number(option.price || 0);
          }
        });
      }
    });

    return total;
  }

  getFinalPrice(): number {
    if (!this.product) return 0;

    return this.product.price + this.getModifiersTotal();
  }

  submitReview(): void {
    if (!this.product) return;
    if (!this.reviewComment.trim()) return;

    this.productService
      .addReview(this.product._id, {
        rating: this.reviewRating,
        comment: this.reviewComment,
      })
      .subscribe({
        next: (res: any) => {
          if (!this.product) return;

          this.product.reviews = res.reviews;
          this.product.ratingAverage = res.ratingAverage;
          this.product.ratingCount = res.ratingCount;

          this.reviewComment = '';
          this.reviewRating = 5;
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  toggleLike(): void {
    if (!this.product) return;

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.userService.toggleSavedProduct(this.product._id).subscribe({
      next: (res) => {
        this.isSaved = res.savedProducts.some((item: any) => item._id === this.product?._id);
      },
    });
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  onTouchEnd(event: TouchEvent): void {
    this.touchEndX = event.changedTouches[0].screenX;

    const swipeDistance = this.touchStartX - this.touchEndX;

    if (Math.abs(swipeDistance) < 50) return;

    if (swipeDistance > 0) {
      this.nextImage();
    } else {
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

    this.selectedImageIndex = (this.selectedImageIndex + 1) % this.product.images.length;

    this.selectedImage = this.product.images[this.selectedImageIndex];
  }

  prevImage(): void {
    if (!this.product?.images?.length) return;

    this.selectedImageIndex =
      (this.selectedImageIndex - 1 + this.product.images.length) % this.product.images.length;

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

    const modifiers = this.getSelectedModifiersPayload();

    this.cartService.addToCart(
      this.product,
      this.quantity,
      this.selectedColor,
      this.selectedSize,
      this.customText,
      modifiers,
      this.customerModifierImages,
    );

    this.added = true;
    setTimeout(() => (this.added = false), 1800);
  }
}
