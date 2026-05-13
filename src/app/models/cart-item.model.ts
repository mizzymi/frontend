import { Product } from './product.model';

export interface CartItem {
  product: Product;
  quantity: number;
  color?: string;
  size?: string;
  customText?: string;
  modifiers?: any[];
  customerImages?: any;
}
