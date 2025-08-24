import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { CommonModule } from '@angular/common';
import { Product, ProductVariant } from '../../../models/product.model';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule],
  template: `
    <div
      class="group relative bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <!-- Product Image -->
      <div class="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gray-200">
        <img
          [src]="product.thumbnail || product.images?.[0]?.url || '/assets/placeholder-product.jpg'"
          [alt]="product.title"
          class="h-48 w-full object-cover object-center group-hover:opacity-75 cursor-pointer"
          (click)="viewProduct()"
        />
        <div
          class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <button
            (click)="viewProduct()"
            class="bg-white text-gray-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 shadow-md"
          >
            View Details
          </button>
        </div>
      </div>

      <!-- Product Info -->
      <div class="p-4">
        <h3
          class="text-lg font-medium text-gray-900 cursor-pointer hover:text-blue-600"
          (click)="viewProduct()"
        >
          {{ product.title }}
        </h3>
        <p *ngIf="product.subtitle" class="text-sm text-gray-500 mt-1">
          {{ product.subtitle }}
        </p>

        <!-- Price -->
        <div class="mt-2 flex items-center justify-between">
          <div>
            <span class="text-lg font-semibold text-gray-900">
              {{ getDisplayPrice() | currency : 'USD' : 'symbol' : '1.2-2' }}
            </span>
            <span *ngIf="hasVariants()" class="text-sm text-gray-500 ml-1">
              {{ getVariantCount() }} variants
            </span>
          </div>
        </div>

        <!-- Add to Cart -->
        <div class="mt-4">
          <button
            *ngIf="!hasVariants() && getDefaultVariant(); else viewProductBtn"
            (click)="addToCart()"
            [disabled]="isAddingToCart"
            class="w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span *ngIf="!isAddingToCart">Add to Cart</span>
            <span *ngIf="isAddingToCart">Adding...</span>
          </button>
          <ng-template #viewProductBtn>
            <button
              (click)="viewProduct()"
              class="w-full bg-gray-100 text-gray-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Select Options
            </button>
          </ng-template>
        </div>
      </div>
    </div>
  `,
})
export class ProductCardComponent {
  @Input() product!: Product;

  isAddingToCart = false;

  constructor(private readonly router: Router, private readonly cartService: CartService) {}

  viewProduct() {
    this.router.navigate(['/products', this.product.id]);
  }

  getDisplayPrice(): number {
    const variant = this.getDefaultVariant();
    if (variant && variant.prices && variant.prices.length > 0) {
      return variant.prices[0].amount / 100; // Convert from cents
    }
    return 0;
  }

  getDefaultVariant(): ProductVariant | undefined {
    return this.product.variants?.[0];
  }

  hasVariants(): boolean {
    return this.product.variants && this.product.variants.length > 1;
  }

  getVariantCount(): number {
    return this.product.variants?.length || 0;
  }

  addToCart() {
    const variant = this.getDefaultVariant();
    if (!variant) return;

    this.isAddingToCart = true;
    this.cartService.addToCart(variant.id, 1).subscribe({
      next: () => {
        this.isAddingToCart = false;
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
        this.isAddingToCart = false;
      },
    });
  }
}
