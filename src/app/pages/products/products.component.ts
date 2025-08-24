import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MedusaService } from '../../services/medusa.service';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { ProductGridComponent } from '../../components/product/product-grid/product-grid.component';

@Component({
  selector: 'app-products',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ProductGridComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Products</h1>
        <p class="mt-2 text-gray-600">Discover our full range of products</p>
      </div>

      <!-- Filters and Search -->
      <div class="flex flex-col sm:flex-row gap-4 mb-8">
        <!-- Search -->
        <div class="flex-1">
          <div class="relative">
            <input
              [formControl]="searchControl"
              type="text"
              placeholder="Search products..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <svg
              class="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
        </div>

        <!-- Sort -->
        <div class="sm:w-48">
          <select
            [(ngModel)]="sortBy"
            (change)="onSortChange()"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Sort by</option>
            <option value="created_at">Newest</option>
            <option value="title">Name A-Z</option>
            <option value="-title">Name Z-A</option>
          </select>
        </div>
      </div>

      <!-- Products Grid -->
      <div *ngIf="isLoading" class="text-center py-12">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
        ></div>
        <p class="mt-2 text-gray-600">Loading products...</p>
      </div>

      <div *ngIf="!isLoading">
        <div *ngIf="products.length > 0; else noProducts">
          <app-product-grid [products]="products"></app-product-grid>

          <!-- Pagination -->
          <div *ngIf="totalCount > limit" class="mt-12 flex justify-center">
            <nav class="flex items-center space-x-2">
              <button
                (click)="previousPage()"
                [disabled]="offset === 0"
                class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <span class="px-4 py-2 text-sm text-gray-700">
                Page {{ currentPage }} of {{ totalPages }}
              </span>

              <button
                (click)="nextPage()"
                [disabled]="offset + limit >= totalCount"
                class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        </div>

        <ng-template #noProducts>
          <div class="text-center py-12">
            <svg
              class="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8v8a2 2 0 01-2 2H9a2 2 0 01-2-2V5a2 2 0 012-2h8a2 2 0 012 2z"
              ></path>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No products found</h3>
            <p class="mt-1 text-sm text-gray-500">Try adjusting your search criteria.</p>
          </div>
        </ng-template>
      </div>
    </div>
  `,
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  isLoading = false;

  // Pagination
  offset = 0;
  limit = 12;
  totalCount = 0;

  // Search and filters
  searchControl = new FormControl('');
  sortBy = '';

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly medusaService: MedusaService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit() {
    // Handle search from query params
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      if (params['search']) {
        this.searchControl.setValue(params['search'], { emitEvent: false });
      }
    });

    // Setup search debouncing
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.offset = 0;
        this.loadProducts();
      });

    this.loadProducts();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProducts() {
    this.isLoading = true;

    const params: any = {
      offset: this.offset,
      limit: this.limit,
    };

    const searchValue = this.searchControl.value;
    if (searchValue && searchValue.trim()) {
      params.q = searchValue.trim();
    }

    if (this.sortBy) {
      params.order = this.sortBy;
    }

    this.medusaService.getProducts(params).subscribe({
      next: (response) => {
        this.products = response.products;
        this.totalCount = response.count;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoading = false;
      },
    });
  }

  onSortChange() {
    this.offset = 0;
    this.loadProducts();
  }

  get currentPage(): number {
    return Math.floor(this.offset / this.limit) + 1;
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.limit);
  }

  previousPage() {
    if (this.offset > 0) {
      this.offset -= this.limit;
      this.loadProducts();
    }
  }

  nextPage() {
    if (this.offset + this.limit < this.totalCount) {
      this.offset += this.limit;
      this.loadProducts();
    }
  }
}
