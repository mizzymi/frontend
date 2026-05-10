import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { guestGuard } from './core/guards/guest.guard';

import { Home } from './pages/home/home';
import { Shop } from './pages/shop/shop';
import { ProductDetail } from './pages/product-detail/product-detail';
import { Cart } from './pages/cart/cart';
import { Checkout } from './pages/checkout/checkout';
import { CheckoutSuccess } from './pages/checkout-success/checkout-success';
import { Custom } from './pages/custom/custom';

import { Login } from './pages/User/login/login';
import { Register } from './pages/User/register/register';
import { Profile } from './pages/User/profile/profile';

import { AdminLayout } from './pages/admin/admin-layout/admin-layout';
import { AdminDashboard } from './pages/admin/admin-dashboard/admin-dashboard';
import { AdminProducts } from './pages/admin/admin-products/admin-products';
import { AdminOrders } from './pages/admin/admin-orders/admin-orders';
import { AdminCustoms } from './pages/admin/admin-customs/admin-customs';
import { AdminLogin } from './pages/admin/admin-login/admin-login';

export const routes: Routes = [
    // SHOP

    { path: '', component: Home },

    { path: 'shop', component: Shop },

    { path: 'product/:id', component: ProductDetail },

    { path: 'cart', component: Cart },

    { path: 'checkout', component: Checkout },

    { path: 'success', component: CheckoutSuccess },

    { path: 'custom', component: Custom },

    // USER

    {
        path: 'login',
        component: Login,
        canActivate: [guestGuard]
    },

    {
        path: 'register',
        component: Register,
        canActivate: [guestGuard]
    },

    {
        path: 'profile',
        component: Profile,
        canActivate: [authGuard]
    },
    {
        path: 'admin/login',
        component: AdminLogin
    },
    {
        path: 'admin',
        component: AdminLayout,
        canActivate: [adminGuard],
        children: [
            {
                path: '',
                component: AdminDashboard
            },

            {
                path: 'products',
                component: AdminProducts
            },

            {
                path: 'orders',
                component: AdminOrders
            },

            {
                path: 'customs',
                component: AdminCustoms
            }
        ]
    },

    // FALLBACK

    {
        path: '**',
        redirectTo: ''
    }
];