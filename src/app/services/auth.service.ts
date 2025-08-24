import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { MedusaService } from './medusa.service';
import { Customer } from '../models/cart.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly currentUserSubject = new BehaviorSubject<Customer | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private readonly tokenKey = 'medusa_auth_token';

  constructor(private readonly medusaService: MedusaService) {
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    if (this.hasToken()) {
      this.medusaService
        .getCurrentCustomer()
        .pipe(
          tap((response) => this.currentUserSubject.next(response.customer)),
          catchError((error) => {
            this.removeToken();
            return throwError(error);
          })
        )
        .subscribe();
    }
  }

  login(email: string, password: string): Observable<Customer> {
    return this.medusaService.authenticate(email, password).pipe(
      tap((response) => {
        this.setToken('authenticated'); // Medusa uses session-based auth
        this.currentUserSubject.next(response.customer);
      }),
      map((response) => response.customer),
      catchError((error) => {
        console.error('Login error:', error);
        return throwError(error);
      })
    );
  }

  register(customerData: {
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
  }): Observable<Customer> {
    return this.medusaService.createCustomer(customerData).pipe(
      map((response) => response.customer),
      catchError((error) => {
        console.error('Registration error:', error);
        return throwError(error);
      })
    );
  }

  logout(): Observable<any> {
    return this.medusaService.logout().pipe(
      tap(() => {
        this.removeToken();
        this.currentUserSubject.next(null);
      }),
      catchError((error) => {
        console.error('Logout error:', error);
        // Even if logout fails on server, clear local state
        this.removeToken();
        this.currentUserSubject.next(null);
        return throwError(error);
      })
    );
  }

  getCurrentUser(): Customer | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  private hasToken(): boolean {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(this.tokenKey) !== null;
    }
    return false;
  }

  private setToken(token: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  private removeToken(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
    }
  }
}
