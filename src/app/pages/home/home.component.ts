import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MedusaService } from '../../services/medusa.service';
import { ProductGridComponent } from '../../components/product/product-grid/product-grid.component';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-home',
  imports: [ProductGridComponent, CommonModule],
  template: `
    <!-- Hero Section -->
    <section class="relative bg-gray-900">
      <div class="absolute inset-0">
        <img src="/assets/hero-bg.jpg" 
             alt="Hero background" 
             class="h-full w-full object-cover opacity-50">
      </div>
      <div class="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Welcome to Our Store
          </h1>
          <p class="mt-6 max-w-lg mx-auto text-xl text-gray-300 sm:max-w-3xl">
            Discover amazing products at unbeatable prices. Shop with confidence and enjoy fast, free shipping on orders over $50.
          </p>
          <div class="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
            <button (click)="shopNow()" 
                    class="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
              Shop Now
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-gray-900 sm:text-4xl">Featured Products</h2>
          <p class="mt-4 text-lg text-gray-600">Check out our most popular items</p>
        </div>

        <div class="mt-12">
          <div *ngIf="isLoading" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p class="mt-2 text-gray-600">Loading products...</p>
          </div>

          <app-product-grid [products]="featuredProducts"></app-product-grid>

          <div class="text-center mt-12">
            <button (click)="viewAllProducts()" 
                    class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200">
              View All Products
              <svg class="ml-2 -mr-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div class="text-center">
            <div class="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white mx-auto">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
            <h3 class="mt-4 text-lg font-medium text-gray-900">Best Prices</h3>
            <p class="mt-2 text-gray-600">We offer competitive prices on all our products with price matching guarantee.</p>
          </div>

          <div class="text-center">
            <div class="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white mx-auto">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
            </div>
            <h3 class="mt-4 text-lg font-medium text-gray-900">Fast Shipping</h3>
            <p class="mt-2 text-gray-600">Free shipping on orders over $50. Express delivery available.</p>
          </div>

          <div class="text-center">
            <div class="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white mx-auto">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h3 class="mt-4 text-lg font-medium text-gray-900">Secure Shopping</h3>
            <p class="mt-2 text-gray-600">Your payment information is protected with enterprise-grade security.</p>
          </div>
        </div>
      </div>
    </section>
  `
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];
  isLoading = true;

  constructor(
    private readonly medusaService: MedusaService,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.loadFeaturedProducts();
  }

  loadFeaturedProducts() {
    this.medusaService.getProducts({ limit: 8 }).subscribe({
      next: (response) => {
        this.featuredProducts = response.products;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading featured products:', error);
        this.isLoading = false;
      }
    });
  }

  shopNow() {
    this.router.navigate(['/products']);
  }

  viewAllProducts() {
    this.router.navigate(['/products']);
  }
}