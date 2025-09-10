import type { CheckoutSessionRequest, OrderState } from "@/components/ui/types";
import axios from "axios";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const API_END_POINT = "http://localhost:9000/api/order";
axios.defaults.withCredentials = true;

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      loading: false,
      orders: [],
      createCheckOutSession: async (
        checkoutSession: CheckoutSessionRequest
      ) => {
        try {
          set({ loading: true });
          const response = await axios.post(
            `${API_END_POINT}/checkout/create-checkout-session`,
            checkoutSession,
            {
              headers: {
                "Content-Type": "application/json", // ✅ use JSON
              },
            }
          );
          console.log("checkout response:", response.data);
          const url = response?.data?.session?.url;
          console.log(url);
          if (url) {
            window.location.href = url;
          } else {
            console.error("No session URL in response:", response.data);
          }

          set({ loading: false });
        } catch (err) {
          set({ loading: false });
          console.log(err);
        }
      },
      getOrderDetails: async () => {
        try {
          set({ loading: true });

          const response = await axios.get(`${API_END_POINT}/get-order`);
          set({ loading: false, orders: response.data.orders });
        } catch (err) {
          set({ loading: false });
          console.log(err);
        }
      },
    }),
    {
      name: "order-name",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
