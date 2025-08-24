import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CartService } from '../../../services/cart.service';
import { AuthService } from '../../../services/auth.service';
import { Customer } from '../../../models/cart.model';
import { CommonModule } from '@angular/common';
import { CartSidebarComponent } from '../../cart/cart-sidebar/cart-sidebar.component';


@Component({
  selector: 'app-header',
  imports: [CommonModule, CartSidebarComponent],
  template: `
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex-shrink-0">
            <a routerLink="/" class="text-2xl font-bold text-gray-900"> StoreFront </a>
          </div>

          <!-- Navigation -->
          <nav class="hidden md:flex space-x-8">
            <a
              routerLink="/products"
              class="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              routerLinkActive="text-gray-900 border-b-2 border-gray-900"
            >
              Products
            </a>
            <a href="#" class="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
              Categories
            </a>
            <a href="#" class="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
              About
            </a>
          </nav>

          <!-- Right side -->
          <div class="flex items-center space-x-4">
            <!-- Search -->
            <div class="relative hidden lg:block">
              <input
                type="text"
                placeholder="Search products..."
                class="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                (keyup.enter)="onSearch($event)"
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

            <!-- Auth -->
            <div *ngIf="!currentUser; else userMenu">
              <button
                (click)="goToLogin()"
                class="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Sign In
              </button>
            </div>
            <ng-template #userMenu>
              <div class="relative" (click)="toggleUserMenu()">
                <button
                  class="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <span class="sr-only">Open user menu</span>
                  <div class="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <span class="text-sm font-medium text-gray-700">
                      {{ currentUser?.first_name?.charAt(0) || currentUser?.email?.charAt(0) }}
                    </span>
                  </div>
                </button>
                <div
                  *ngIf="showUserMenu"
                  class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                >
                  <div class="py-1">
                    <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >Profile</a
                    >
                    <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >Orders</a
                    >
                    <button
                      (click)="logout()"
                      class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </ng-template>

            <!-- Cart -->
            <button (click)="toggleCart()" class="relative p-2 text-gray-700 hover:text-gray-900">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M7 13h10"
                ></path>
              </svg>
              <span
                *ngIf="cartItemCount > 0"
                class="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center"
              >
                {{ cartItemCount }}
              </span>
            </button>
          </div>

          <!-- Mobile menu button -->
          <div class="md:hidden">
            <button
              (click)="toggleMobileMenu()"
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile menu -->
        <div *ngIf="showMobileMenu" class="md:hidden">
          <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              routerLink="/products"
              class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
            >
              Products
            </a>
            <a
              href="#"
              class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
            >
              Categories
            </a>
            <a
              href="#"
              class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
            >
              About
            </a>
          </div>
        </div>
      </div>
    </header>

    <!-- Cart Sidebar -->
    <app-cart-sidebar [isOpen]="showCartSidebar" (close)="toggleCart()"></app-cart-sidebar>
  `,
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser: Customer | null = null;
  cartItemCount = 0;
  showCartSidebar = false;
  showUserMenu = false;
  showMobileMenu = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly cartService: CartService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit() {
    // Subscribe to current user
    this.authService.currentUser$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      this.currentUser = user;
    });

    // Subscribe to cart item count
    this.cartService
      .getCartItemCount()
      .pipe(takeUntil(this.destroy$))
      .subscribe((count) => {
        this.cartItemCount = count;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch(event: any) {
    const query = event.target.value.trim();
    if (query) {
      this.router.navigate(['/products'], { queryParams: { search: query } });
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.showUserMenu = false;
      this.router.navigate(['/']);
    });
  }

  toggleCart() {
    this.showCartSidebar = !this.showCartSidebar;
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }
}
