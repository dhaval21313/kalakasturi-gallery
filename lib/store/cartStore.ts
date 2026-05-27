"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  title: string;
  price: number; // Stored as number (e.g. 22999) representing local numeric values
  priceRaw: string; // The formatted string e.g. "₹22,999"
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  openCart: () => void;
  closeCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      addItem: (newItem) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(item => item.id === newItem.id);
        if (existingItem) {
          set({
            items: currentItems.map(item =>
              item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item
            ),
          });
        } else {
          set({ items: [...currentItems, { ...newItem, quantity: 1 }] });
        }
        // Automatically open the cart drawer when a new item is added!
        set({ isCartOpen: true });
      },
      removeItem: (id) => set({ items: get().items.filter(item => item.id !== id) }),
      updateQuantity: (id, qty) => {
        if (qty <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map(item => item.id === id ? { ...item, quantity: qty } : item)
        });
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
      getTotalPrice: () => get().items.reduce((total, item) => total + (item.price * item.quantity), 0),
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
    }),
    {
      name: 'kalakasturi-cart',
      partialize: (state) => ({ items: state.items }), // Only persist items, not the UI open/close drawer state!
    }
  )
);

