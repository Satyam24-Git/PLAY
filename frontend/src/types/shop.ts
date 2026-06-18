export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  rating: number;
  reviewsCount: number;
  sizes?: string[];
  colors?: string[];
}

export interface CartItem {
  id: string; // Unique cart item ID (in case same product added with different sizes)
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'shipped' | 'delivered';
  createdAt: string;
}
