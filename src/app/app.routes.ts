import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Shop } from './pages/shop/shop';
import { ProductDetail } from './pages/product-detail/product-detail';
import { Cart } from './pages/cart/cart';
import { Checkout } from './pages/checkout/checkout';
import { CheckoutSuccess } from './pages/checkout-success/checkout-success';
import { Custom } from './pages/custom/custom';
import { AdminLayout } from './pages/admin/admin-layout/admin-layout';
import { AdminDashboard } from './pages/admin/admin-dashboard/admin-dashboard';
import { AdminProducts } from './pages/admin/admin-products/admin-products';
import { AdminOrders } from './pages/admin/admin-orders/admin-orders';
import { AdminCustoms } from './pages/admin/admin-customs/admin-customs';
import { AdminLogin } from './pages/admin/admin-login/admin-login';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'shop', component: Shop },
    { path: 'product/:id', component: ProductDetail },
    { path: 'cart', component: Cart },
    { path: 'checkout', component: Checkout },
    { path: 'success', component: CheckoutSuccess },
    { path: 'custom', component: Custom },
    {
        path: 'admin/login',
        component: AdminLogin
    },
    {
        path: 'admin',
        component: AdminLayout,
        children: [
            { path: '', component: AdminDashboard },
            { path: 'products', component: AdminProducts },
            { path: 'orders', component: AdminOrders },
            { path: 'customs', component: AdminCustoms }
        ]
    },
    { path: '**', redirectTo: '' }
];