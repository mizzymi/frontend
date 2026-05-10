import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
    const router = inject(Router);

    const token = localStorage.getItem('adminToken');

    if (!token) {
        router.navigate(['/admin/login']);
        return false;
    }

    return true;
};