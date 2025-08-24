import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="bg-white border-t border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Company Info -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900">StoreFront</h3>
            <p class="text-gray-600 text-sm">
              Your trusted online store for quality products at great prices.
            </p>
            <div class="flex space-x-4">
              <a href="#" class="text-gray-400 hover:text-gray-500">
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  />
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-gray-500">
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"
                  />
                </svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-gray-500">
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
                  />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>

          <!-- Products -->
          <div class="space-y-4">
            <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider">Products</h3>
            <ul class="space-y-2">
              <li><a href="#" class="text-gray-600 hover:text-gray-900 text-sm">Categories</a></li>
              <li>
                <a href="#" class="text-gray-600 hover:text-gray-900 text-sm">New Arrivals</a>
              </li>
              <li>
                <a href="#" class="text-gray-600 hover:text-gray-900 text-sm">Best Sellers</a>
              </li>
              <li><a href="#" class="text-gray-600 hover:text-gray-900 text-sm">Sale</a></li>
            </ul>
          </div>

          <!-- Customer Service -->
          <div class="space-y-4">
            <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Customer Service
            </h3>
            <ul class="space-y-2">
              <li><a href="#" class="text-gray-600 hover:text-gray-900 text-sm">Contact Us</a></li>
              <li>
                <a href="#" class="text-gray-600 hover:text-gray-900 text-sm">Shipping Info</a>
              </li>
              <li><a href="#" class="text-gray-600 hover:text-gray-900 text-sm">Returns</a></li>
              <li><a href="#" class="text-gray-600 hover:text-gray-900 text-sm">Size Guide</a></li>
            </ul>
          </div>

          <!-- Company -->
          <div class="space-y-4">
            <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider">Company</h3>
            <ul class="space-y-2">
              <li><a href="#" class="text-gray-600 hover:text-gray-900 text-sm">About Us</a></li>
              <li><a href="#" class="text-gray-600 hover:text-gray-900 text-sm">Careers</a></li>
              <li>
                <a href="#" class="text-gray-600 hover:text-gray-900 text-sm">Privacy Policy</a>
              </li>
              <li>
                <a href="#" class="text-gray-600 hover:text-gray-900 text-sm">Terms of Service</a>
              </li>
            </ul>
          </div>
        </div>

        <div class="border-t border-gray-200 py-6">
          <p class="text-sm text-gray-600 text-center">
            © 2025 StoreFront. All rights reserved. Built with Angular and Medusa.
          </p>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {}
