export interface Product {
    _id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    images: string[];
    category: string;
    colors: string[];
    sizes: string[];
    stock: number;
    customizable: boolean;
    featured: boolean;
}