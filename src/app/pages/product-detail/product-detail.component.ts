import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MedusaService } from '../../services/medusa.service';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { Product, ProductVariant } from '../../models/product.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="product" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
        <!-- Image Gallery -->
        <div class="flex flex-col-reverse">
          <!-- Thumbnail Images -->
          <div *ngIf="product.images && product.images.length > 1" 
               class="hidden mt-6 w-full max-w-2xl mx-auto sm:block lg:max-w-none">
            <div class="grid grid-cols-4 gap-6">
              <button
                *ngFor="let image of product.images; let i = index"
                (click)="selectedImageIndex = i"
                class="relative h-24 bg-white rounded-md flex items-center justify-center text-sm font-medium uppercase text-gray-900 cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring focus:ring-offset-4 focus:ring-blue-500"
                [class.ring-2]="selectedImageIndex === i"
                [class.ring-blue-500]="selectedImageIndex === i">
                <img [src]="image.url" 
                     [alt]="product.title"
                     class="h-full w-full object-cover object-center rounded-md">
              </button>
            </div>
          </div>

          <!-- Main Image -->
          <div class="w-full aspect-w-1 aspect-h-1">
            <img [src]="getCurrentImage()" 
                 [alt]="product.title"
                 class="w-full h-96 object-cover object-center sm:rounded-lg">
          </div>
        </div>

        <!-- Product Info -->
        <div class="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
          <h1 class="text-3xl font-bold tracking-tight text-gray-900">{{ product.title }}</h1>
          
          <div class="mt-3">
            <h2 class="sr-only">Product information</h2>
            <p class="text-3xl tracking-tight text-gray-900">{{ getDisplayPrice() | currency:'USD':'symbol':'1.2-2' }}</p>
          </div>

          <!-- Description -->
          <div class="mt-6">
            <h3 class="sr-only">Description</h3>
            <div class="text-base text-gray-700" [innerHTML]="product.description"></div>
          </div>

          <!-- Options -->
          <div *ngIf="product.options && product.options.length > 0" class="mt-6">
            <div *ngFor="let option of product.options" class="mt-6">
              <h3 class="text-sm font-medium text-gray-900">{{ option.title }}</h3>
              <div class="mt-2">
                <div class="flex flex-wrap gap-2">
                  <button
                    *ngFor="let value of option.values"
                    (click)="selectOption(option.id, value.id)"
                    class="px-4 py-2 text-sm font-medium border rounded-md"
                    [class.border-blue-500]="selectedOptions[option.id] === value.id"
                    [class.bg-blue-50]="selectedOptions[option.id] === value.id"
                    [class.text-blue-700]="selectedOptions[option.id] === value.id"
                    [class.border-gray-300]="selectedOptions[option.id] !== value.id"
                    [class.text-gray-900]="selectedOptions[option.id] !== value.id">
                    {{ value.value }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Quantity -->
          <div class="mt-6">
            <h3 class="text-sm font-medium text-gray-900">Quantity</h3>
            <div class="mt-2 flex items-center space-x-3">
              <button
                (click)="decreaseQuantity()"
                [disabled]="quantity <= 1"
                class="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                </svg>
              </button>
              
              <input
                [(ngModel)]="quantity"
                type="number"
                min="1"
                class="w-16 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              
              <button
                (click)="increaseQuantity()"
                class="p-2 rounded-md border border-gray-300 hover:bg-gray-50">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Add to Cart -->
          <div class="mt-10 flex">
            <button
              (click)="addToCart()"
              [disabled]="!canAddToCart() || isAddingToCart"
              class="max-w-xs flex-1 bg-blue-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
              <span *ngIf="!isAddingToCart">Add to Cart</span>
              <span *ngIf="isAddingToCart" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </span>
            </button>
          </div>

          <!-- Stock Status -->
          <div class="mt-6 text-sm">
            <div *ngIf="selectedVariant">
              <span *ngIf="selectedVariant.inventory_quantity > 0" class="text-green-600 font-medium">
                In Stock ({{ selectedVariant.inventory_quantity }} available)
              </span>
              <span *ngIf="selectedVariant.inventory_quantity <= 0 && selectedVariant.allow_backorder" 
                    class="text-yellow-600 font-medium">
                Available for backorder
              </span>
              <span *ngIf="selectedVariant.inventory_quantity <= 0 && !selectedVariant.allow_backorder" 
                    class="text-red-600 font-medium">
                Out of stock
              </span>
            </div>
          </div>

          <!-- Product Details -->
          <div class="mt-10 border-t border-gray-200 pt-10">
            <h3 class="text-sm font-medium text-gray-900">Product Details</h3>
            <div class="mt-4 space-y-6">
              <p class="text-sm text-gray-600">{{ product.description }}</p>
              
              <div *ngIf="selectedVariant" class="text-sm text-gray-600">
                <div *ngIf="selectedVariant.sku">
                  <strong>SKU:</strong> {{ selectedVariant.sku }}
                </div>
                <div *ngIf="selectedVariant.weight">
                  <strong>Weight:</strong> {{ selectedVariant.weight }}g
                </div>
                <div *ngIf="selectedVariant.material">
                  <strong>Material:</strong> {{ selectedVariant.material }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div *ngIf="!product && !error" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600">Loading product...</p>
      </div>
    </div>

    <!-- Error State -->
    <div *ngIf="error" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="text-center py-12">
        <h2 class="text-2xl font-bold text-gray-900">Product not found</h2>
        <p class="mt-2 text-gray-600">The product you're looking for doesn't exist or has been removed.</p>
        <button (click)="goBack()" 
                class="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
          Go Back
        </button>
      </div>
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  selectedVariant: ProductVariant | null = null;
  selectedOptions: { [optionId: string]: string } = {};
  selectedImageIndex = 0;
  quantity = 1;
  isAddingToCart = false;
  error = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly medusaService: MedusaService,
    private readonly cartService: CartService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadProduct(params['id']);
      }
    });
  }

  loadProduct(id: string) {
    this.medusaService.getProduct(id).subscribe({
      next: (response) => {
        this.product = response.product;
        this.initializeVariant();
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.error = true;
      }
    });
  }

  initializeVariant() {
    if (this.product?.variants && this.product.variants.length > 0) {
      this.selectedVariant = this.product.variants[0];
      
      // Initialize selected options based on first variant
      if (this.selectedVariant.options) {
        this.selectedVariant.options.forEach(option => {
          this.selectedOptions[option.option_id] = option.id;
        });
      }
    }
  }

  getCurrentImage(): string {
    if (this.product?.images && this.product.images.length > 0) {
      return this.product.images[this.selectedImageIndex]?.url;
    }
    return this.product?.thumbnail || '/assets/placeholder-product.jpg';
  }

  getDisplayPrice(): number {
    if (this.selectedVariant?.prices && this.selectedVariant.prices.length > 0) {
      return this.selectedVariant.prices[0].amount / 100;
    }
    return 0;
  }

  selectOption(optionId: string, valueId: string) {
    this.selectedOptions[optionId] = valueId;
    this.updateSelectedVariant();
  }

  updateSelectedVariant() {
    if (!this.product?.variants) return;

    // Find variant that matches selected options
    const matchingVariant = this.product.variants.find(variant => {
      return variant.options?.every(option => 
        this.selectedOptions[option.option_id] === option.id
      );
    });

    if (matchingVariant) {
      this.selectedVariant = matchingVariant;
    }
  }

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  canAddToCart(): boolean {
    return !!(this.selectedVariant && 
             (this.selectedVariant.inventory_quantity > 0 || this.selectedVariant.allow_backorder));
  }

  addToCart() {
    if (!this.selectedVariant || !this.canAddToCart()) return;

    this.isAddingToCart = true;
    this.cartService.addToCart(this.selectedVariant.id, this.quantity).subscribe({
      next: () => {
        this.isAddingToCart = false;
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
        this.isAddingToCart = false;
      }
    });
  }

  goBack() {
    window.history.back();
  }
}

