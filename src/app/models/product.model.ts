export interface ProductReview {
  _id?: string;
  user: string;
  username: string;
  profileImage?: string;
  rating: number;
  comment: string;
  createdAt?: string;
}

export interface ProductModifierOption {
  id: string;
  label: string;
  price: number;
  description?: string;
  image?: string;
}

export interface ProductModifier {
  id: string;
  name: string;
  type: 'single' | 'multiple';
  required?: boolean;
  options: ProductModifierOption[];
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  category: string[];
  colors: string[];
  sizes: string[];

  modifiers: ProductModifier[];

  weight?: number;
  width?: number;
  height?: number;
  depth?: number;

  stock: number;
  customizable: boolean;
  featured: boolean;

  ratingAverage: number;
  ratingCount: number;
  reviews: ProductReview[];

  createdAt?: string;
  updatedAt?: string;
}
