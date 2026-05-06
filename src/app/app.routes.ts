import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Shop } from './pages/shop/shop';
import { ProductDetail } from './pages/product-detail/product-detail';
import { Cart } from './pages/cart/cart';
import { Checkout } from './pages/checkout/checkout';
import { CheckoutSuccess } from './pages/checkout-success/checkout-success';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'shop', component: Shop },
    { path: 'product/:id', component: ProductDetail },
    { path: 'cart', component: Cart },
    { path: 'checkout', component: Checkout },
    { path: 'success', component: CheckoutSuccess },
    { path: '**', redirectTo: '' }
];