import { Product, Order, CartItem } from '../types/shop';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

export const shopService = {
  fetchProducts: async (): Promise<Product[]> => {
    const response = await fetch(`${API_URL}/api/shop/products`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return response.json();
  },

  fetchProductById: async (id: string): Promise<Product | undefined> => {
    const response = await fetch(`${API_URL}/api/shop/products/${id}`);
    if (!response.ok) {
      if (response.status === 404) return undefined;
      throw new Error('Failed to fetch product');
    }
    return response.json();
  },

  placeOrder: async (items: CartItem[], total: number, shippingInfo: any): Promise<Order> => {
    const response = await fetch(`${API_URL}/api/shop/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items,
        total,
        // In real app we'd pass shippingInfo here too
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to place order');
    }
    
    return response.json();
  }
};
