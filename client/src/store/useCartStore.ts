import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartState, MenuItems } from "@/components/ui/types";

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      addToCart: (item: MenuItems) => {
        set((state) => {
          const excitingItem = state.cart.find(
            (cartItem) => cartItem._id === item._id
          );
          if (excitingItem) {
            return {
              cart: state.cart.map((cartItem) =>
                cartItem._id === item._id
                  ? { ...cartItem, quantity: cartItem.quantity + 1 }
                  : cartItem
              ),
            };
          } else {
            return {
              cart: [...state.cart, { ...item, quantity: 1 }],
            };
          }
        });
      },
      clearCart: () => {
        set({ cart: [] });
      },
      removeFromTheCart: (id: string) => {
        set((state) => ({
          cart: state.cart.filter((item) => item._id !== id),
        }));
      },
      incrementQuantity: (id: string) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item._id === id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        }));
      },
      decrementQuantity: (id: string) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item._id === id && item.quantity > 1
              ? { ...item, quantity: item.quantity - 1 }
              : item
          ),
        }));
      },
    }),
    {
      name: "cart-name",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
