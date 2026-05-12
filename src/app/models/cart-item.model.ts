import { Product } from './product.model';

export interface CartItem {
  product: Product;
  quantity: number;
  color?: string;
  size?: string;
  customText?: string;
  weight?: number;
  width?: number;
  height?: number;
  depth?: number;
}
