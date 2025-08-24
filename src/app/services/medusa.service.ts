// services/medusa.service.ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Product } from '../models/product.model';
import { Cart, Customer, Order, Region } from '../models/cart.model';

@Injectable({
  providedIn: 'root',
})
export class MedusaService {
  private readonly baseUrl = environment.medusaBackendUrl;

  constructor(private readonly http: HttpClient) {}

  // Products
  getProducts(
    params?: any
  ): Observable<{ products: Product[]; count: number; offset: number; limit: number }> {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== undefined && params[key] !== null) {
          httpParams = httpParams.append(key, params[key]);
        }
      });
    }

    return this.http.get<any>(`${this.baseUrl}/store/products`, { params: httpParams });
  }

  getProduct(id: string): Observable<{ product: Product }> {
    return this.http.get<any>(`${this.baseUrl}/store/products/${id}`);
  }

  searchProducts(query: string): Observable<{ hits: Product[] }> {
    return this.http.post<any>(`${this.baseUrl}/store/products/search`, { q: query });
  }

  // Regions
  getRegions(): Observable<{ regions: Region[] }> {
    return this.http.get<any>(`${this.baseUrl}/store/regions`);
  }

  getRegion(id: string): Observable<{ region: Region }> {
    return this.http.get<any>(`${this.baseUrl}/store/regions/${id}`);
  }

  // Cart
  createCart(regionId?: string): Observable<{ cart: Cart }> {
    return this.http.post<any>(`${this.baseUrl}/store/carts`, { region_id: regionId });
  }

  getCart(cartId: string): Observable<{ cart: Cart }> {
    return this.http.get<any>(`${this.baseUrl}/store/carts/${cartId}`);
  }

  updateCart(cartId: string, data: any): Observable<{ cart: Cart }> {
    return this.http.post<any>(`${this.baseUrl}/store/carts/${cartId}`, data);
  }

  addLineItem(
    cartId: string,
    item: { variant_id: string; quantity: number }
  ): Observable<{ cart: Cart }> {
    return this.http.post<any>(`${this.baseUrl}/store/carts/${cartId}/line-items`, item);
  }

  updateLineItem(cartId: string, lineId: string, quantity: number): Observable<{ cart: Cart }> {
    return this.http.post<any>(`${this.baseUrl}/store/carts/${cartId}/line-items/${lineId}`, {
      quantity,
    });
  }

  removeLineItem(cartId: string, lineId: string): Observable<{ cart: Cart }> {
    return this.http.delete<any>(`${this.baseUrl}/store/carts/${cartId}/line-items/${lineId}`);
  }

  addShippingMethod(cartId: string, optionId: string): Observable<{ cart: Cart }> {
    return this.http.post<any>(`${this.baseUrl}/store/carts/${cartId}/shipping-methods`, {
      option_id: optionId,
    });
  }

  setPaymentSession(cartId: string, providerId: string): Observable<{ cart: Cart }> {
    return this.http.post<any>(`${this.baseUrl}/store/carts/${cartId}/payment-sessions`, {
      provider_id: providerId,
    });
  }

  updatePaymentSession(cartId: string, providerId: string, data: any): Observable<{ cart: Cart }> {
    return this.http.post<any>(
      `${this.baseUrl}/store/carts/${cartId}/payment-sessions/${providerId}`,
      data
    );
  }

  completeCart(cartId: string): Observable<{ order: Order }> {
    return this.http.post<any>(`${this.baseUrl}/store/carts/${cartId}/complete`, {});
  }

  // Shipping Options
  getShippingOptions(cartId: string): Observable<{ shipping_options: any[] }> {
    return this.http.get<any>(`${this.baseUrl}/store/shipping-options/${cartId}`);
  }

  // Authentication
  createCustomer(data: {
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
  }): Observable<{ customer: Customer }> {
    return this.http.post<any>(`${this.baseUrl}/store/customers`, data);
  }

  authenticate(email: string, password: string): Observable<{ customer: Customer }> {
    return this.http.post<any>(`${this.baseUrl}/store/auth`, { email, password });
  }

  getCurrentCustomer(): Observable<{ customer: Customer }> {
    return this.http.get<any>(`${this.baseUrl}/store/auth`);
  }

  logout(): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/store/auth`);
  }

  // Orders
  getOrders(
    limit?: number,
    offset?: number
  ): Observable<{ orders: Order[]; count: number; offset: number; limit: number }> {
    let params = new HttpParams();
    if (limit) params = params.append('limit', limit.toString());
    if (offset) params = params.append('offset', offset.toString());

    return this.http.get<any>(`${this.baseUrl}/store/customers/me/orders`, { params });
  }

  getOrder(id: string): Observable<{ order: Order }> {
    return this.http.get<any>(`${this.baseUrl}/store/orders/${id}`);
  }
}
