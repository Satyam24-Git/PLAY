import { Product, Order, CartItem } from '../types/shop';
import { MOCK_PRODUCTS } from '../data/mockProducts';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const shopService = {
  fetchProducts: async (): Promise<Product[]> => {
    await delay(800); // Simulate network latency
    return MOCK_PRODUCTS;
  },

  fetchProductById: async (id: string): Promise<Product | undefined> => {
    await delay(500);
    return MOCK_PRODUCTS.find(p => p.id === id);
  },

  placeOrder: async (items: CartItem[], total: number, shippingInfo: any): Promise<Order> => {
    await delay(1500); // Simulate processing payment
    
    const newOrder: Order = {
      id: `ORD-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      items,
      total,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    return newOrder;
  }
};
