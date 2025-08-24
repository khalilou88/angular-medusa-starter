import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home - Your Store',
  },
  {
    path: 'products',
    children: [
      {
        path: '',
        component: ProductsComponent,
        title: 'All Products',
      },
      {
        path: 'category/:categoryId',
        component: ProductsComponent,
        title: 'Products by Category',
      },
      {
        path: ':id',
        component: ProductDetailComponent,
        title: 'Product Details',
      },
    ],
  },
  //   {
  //     path: 'cart',
  //     component: CartComponent,
  //     title: 'Shopping Cart',
  //   },
  //   {
  //     path: 'checkout',
  //     canActivate: [CartGuard],
  //     children: [
  //       {
  //         path: '',
  //         component: CheckoutComponent,
  //         title: 'Checkout',
  //       },
  //       {
  //         path: 'success',
  //         component: CheckoutSuccessComponent,
  //         title: 'Order Confirmed',
  //       },
  //     ],
  //   },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        component: LoginComponent,
        title: 'Login',
      },
      {
        path: 'register',
        component: RegisterComponent,
        title: 'Register',
      },
      //   {
      //     path: 'profile',
      //     component: ProfileComponent,
      //     canActivate: [AuthGuard],
      //     title: 'My Profile',
      //   },
    ],
  },
  {
    path: 'search',
    component: ProductsComponent,
    title: 'Search Results',
  },
  //   {
  //     path: '**',
  //     component: NotFoundComponent,
  //     title: '404 - Page Not Found',
  //   },
];
