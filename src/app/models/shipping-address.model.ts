export interface ShippingAddress {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
}