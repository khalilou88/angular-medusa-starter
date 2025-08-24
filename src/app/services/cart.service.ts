import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Cart } from '../models/cart.model';
import { MedusaService } from './medusa.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly cartSubject = new BehaviorSubject<Cart | null>(null);
  public cart$ = this.cartSubject.asObservable();

  private readonly cartIdKey = 'medusa_cart_id';
  private readonly regionIdKey = 'medusa_region_id';

  constructor(private readonly medusaService: MedusaService) {
    this.initializeCart();
  }

  private initializeCart(): void {
    const cartId = this.getCartId();
    if (cartId) {
      this.loadCart(cartId);
    } else {
      this.createNewCart();
    }
  }

  private createNewCart(): void {
    const regionId = this.getRegionId();
    this.medusaService
      .createCart(regionId ? regionId : undefined)
      .pipe(
        tap((response) => {
          this.setCartId(response.cart.id);
          this.cartSubject.next(response.cart);
        }),
        catchError((error) => {
          console.error('Error creating cart:', error);
          return throwError(error);
        })
      )
      .subscribe();
  }

  private loadCart(cartId: string): void {
    this.medusaService
      .getCart(cartId)
      .pipe(
        tap((response) => this.cartSubject.next(response.cart)),
        catchError((error) => {
          console.error('Error loading cart:', error);
          // If cart doesn't exist, create a new one
          this.removeCartId();
          this.createNewCart();
          return of(null);
        })
      )
      .subscribe();
  }

  addToCart(variantId: string, quantity: number = 1): Observable<Cart> {
    const cartId = this.getCartId();
    if (!cartId) {
      return throwError('No cart available');
    }

    return this.medusaService.addLineItem(cartId, { variant_id: variantId, quantity }).pipe(
      tap((response) => this.cartSubject.next(response.cart)),
      map((response) => response.cart),
      catchError((error) => {
        console.error('Error adding item to cart:', error);
        return throwError(error);
      })
    );
  }

  updateQuantity(lineId: string, quantity: number): Observable<Cart> {
    const cartId = this.getCartId();
    if (!cartId) {
      return throwError('No cart available');
    }

    return this.medusaService.updateLineItem(cartId, lineId, quantity).pipe(
      tap((response) => this.cartSubject.next(response.cart)),
      map((response) => response.cart),
      catchError((error) => {
        console.error('Error updating item quantity:', error);
        return throwError(error);
      })
    );
  }

  removeFromCart(lineId: string): Observable<Cart> {
    const cartId = this.getCartId();
    if (!cartId) {
      return throwError('No cart available');
    }

    return this.medusaService.removeLineItem(cartId, lineId).pipe(
      tap((response) => this.cartSubject.next(response.cart)),
      map((response) => response.cart),
      catchError((error) => {
        console.error('Error removing item from cart:', error);
        return throwError(error);
      })
    );
  }

  getCurrentCart(): Cart | null {
    return this.cartSubject.value;
  }

  getCartItemCount(): Observable<number> {
    return this.cart$.pipe(
      map((cart) => cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0)
    );
  }

  clearCart(): void {
    this.removeCartId();
    this.cartSubject.next(null);
    this.createNewCart();
  }

  private getCartId(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(this.cartIdKey);
    }
    return null;
  }

  private setCartId(cartId: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.cartIdKey, cartId);
    }
  }

  private removeCartId(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.cartIdKey);
    }
  }

  private getRegionId(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(this.regionIdKey);
    }
    return null;
  }

  setRegion(regionId: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.regionIdKey, regionId);
    }
  }
}
