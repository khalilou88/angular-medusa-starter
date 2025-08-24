import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CartService } from '../../../services/cart.service';
import { CommonModule } from '@angular/common';
import { Cart, LineItem } from '../../../models/cart.model';

@Component({
  selector: 'app-cart-sidebar',
  imports: [CommonModule],
  template: `
    <!-- Overlay -->
    <div *ngIf="isOpen" class="fixed inset-0 z-50 overflow-hidden" (click)="closeCart()">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black bg-opacity-50 transition-opacity"></div>

      <!-- Sidebar -->
      <div
        class="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform"
        [class.translate-x-0]="isOpen"
        [class.translate-x-full]="!isOpen"
        (click)="$event.stopPropagation()"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b">
          <h2 class="text-lg font-semibold text-gray-900">Shopping Cart</h2>
          <button (click)="closeCart()" class="p-2 -mr-2 text-gray-400 hover:text-gray-500">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <!-- Cart Items -->
        <div class="flex-1 overflow-y-auto p-4">
          <div *ngIf="cart?.items && cart?.items?.length! > 0; else emptyCart">
            <div
              *ngFor="let item of cart?.items; trackBy: trackByItemId"
              class="flex items-center space-x-4 py-4 border-b border-gray-200 last:border-b-0"
            >
              <!-- Item Image -->
              <div class="flex-shrink-0">
                <img
                  [src]="item.thumbnail || '/assets/placeholder-product.jpg'"
                  [alt]="item.title"
                  class="h-16 w-16 rounded-md object-cover"
                />
              </div>

              <!-- Item Details -->
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-medium text-gray-900 truncate">{{ item.title }}</h4>
                <p *ngIf="item.description" class="text-sm text-gray-500 truncate">
                  {{ item.description }}
                </p>

                <!-- Quantity Controls -->
                <div class="flex items-center mt-2 space-x-2">
                  <button
                    (click)="updateQuantity(item.id, item.quantity - 1)"
                    [disabled]="item.quantity <= 1"
                    class="p-1 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M20 12H4"
                      ></path>
                    </svg>
                  </button>

                  <span class="px-2 py-1 text-sm font-medium">{{ item.quantity }}</span>

                  <button
                    (click)="updateQuantity(item.id, item.quantity + 1)"
                    class="p-1 rounded-md border border-gray-300 hover:bg-gray-50"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 4v16m8-8H4"
                      ></path>
                    </svg>
                  </button>

                  <button
                    (click)="removeItem(item.id)"
                    class="p-1 text-red-400 hover:text-red-500 ml-4"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Price -->
              <div class="text-right">
                <div class="text-sm font-medium text-gray-900">
                  {{ item.unit_price / 100 | currency : 'USD' : 'symbol' : '1.2-2' }}
                </div>
                <div class="text-xs text-gray-500">
                  Total: {{ item.total / 100 | currency : 'USD' : 'symbol' : '1.2-2' }}
                </div>
              </div>
            </div>
          </div>

          <ng-template #emptyCart>
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
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M7 13h10"
                ></path>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
              <p class="mt-1 text-sm text-gray-500">Add some items to get started.</p>
              <button
                (click)="closeAndNavigate('/products')"
                class="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Continue Shopping
              </button>
            </div>
          </ng-template>
        </div>

        <!-- Footer -->
        <div *ngIf="cart?.items && cart?.items?.length! > 0" class="border-t p-4 space-y-4">
          <!-- Totals -->
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Subtotal</span>
              <span class="font-medium">{{
                cart?.subtotal! / 100 | currency : 'USD' : 'symbol' : '1.2-2'
              }}</span>
            </div>
            <div *ngIf="cart?.shipping_total! > 0" class="flex justify-between text-sm">
              <span class="text-gray-600">Shipping</span>
              <span class="font-medium">{{
                cart?.shipping_total! / 100 | currency : 'USD' : 'symbol' : '1.2-2'
              }}</span>
            </div>
            <div *ngIf="cart?.tax_total! > 0" class="flex justify-between text-sm">
              <span class="text-gray-600">Tax</span>
              <span class="font-medium">{{
                cart?.tax_total! / 100 | currency : 'USD' : 'symbol' : '1.2-2'
              }}</span>
            </div>
            <div class="flex justify-between text-base font-semibold border-t pt-2">
              <span>Total</span>
              <span>{{ cart?.total! / 100 | currency : 'USD' : 'symbol' : '1.2-2' }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="space-y-2">
            <button
              (click)="closeAndNavigate('/cart')"
              class="w-full bg-gray-100 text-gray-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200"
            >
              View Cart
            </button>
            <button
              (click)="closeAndNavigate('/checkout')"
              class="w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CartSidebarComponent implements OnInit, OnDestroy {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  cart: Cart | null = null;
  private readonly destroy$ = new Subject<void>();

  constructor(private readonly cartService: CartService, private readonly router: Router) {}

  ngOnInit() {
    this.cartService.cart$.pipe(takeUntil(this.destroy$)).subscribe((cart) => {
      this.cart = cart;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  closeCart() {
    this.close.emit();
  }

  closeAndNavigate(route: string) {
    this.closeCart();
    this.router.navigate([route]);
  }

  updateQuantity(lineId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeItem(lineId);
      return;
    }

    this.cartService.updateQuantity(lineId, quantity).subscribe({
      error: (error) => console.error('Error updating quantity:', error),
    });
  }

  removeItem(lineId: string) {
    this.cartService.removeFromCart(lineId).subscribe({
      error: (error) => console.error('Error removing item:', error),
    });
  }

  trackByItemId(index: number, item: LineItem): string {
    return item.id;
  }
}
