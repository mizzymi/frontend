export interface ProductReview {
  _id?: string;
  user: string;
  username: string;
  profileImage?: string;
  rating: number;
  comment: string;
  createdAt?: string;
}

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
