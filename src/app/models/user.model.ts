import { Product } from './product.model';
import { ShippingAddress } from './shipping-address.model';

export interface UserReview {
    _id?: string;
    product: Product;
    rating: number;
    comment: string;
    createdAt?: string;
}

export interface User {
    id: string;
    _id?: string;
    username: string;
    email: string;
    name: string;
    phone?: string;
    role: 'user' | 'admin';
    profileImage: string;
    shippingAddresses: ShippingAddress[];
    savedProducts: Product[];
    myReviews: UserReview[];
    createdAt?: string;
    updatedAt?: string;
}