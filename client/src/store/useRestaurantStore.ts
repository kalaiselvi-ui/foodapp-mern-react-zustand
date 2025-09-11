import type { MenuItems, Orders, RestaurantState } from "@/components/ui/types";
import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const API_END_POINT =
  "https://food-app-server-two-77.vercel.app/api/restaurant";
axios.defaults.withCredentials = true;
const token = localStorage.getItem("token"); // JWT stored at login

export const useRestaurantStore = create<RestaurantState>()(
  persist(
    (set, get) => ({
      loading: false,
      restaurant: null,
      appliedFilter: [],
      restaurantOrders: [],
      searchedRestaurant: null,
      createRestaurant: async (formData: FormData) => {
        try {
          set({ loading: true });
          const response = await axios.post(
            `${API_END_POINT}/create`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            }
          );
          if (response.data.success) {
            toast.success(response.data.message);
            set({ loading: false });
          }
        } catch (err: any) {
          console.log(err);
          toast.error(
            err.response.data.message || "Restaurant creation failed"
          );
          set({ loading: false });
        }
      },
      getRestaurant: async () => {
        try {
          set({ loading: true });
          const response = await axios.get(`${API_END_POINT}/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.data.success) {
            set({ loading: false, restaurant: response.data.restaurant });
          }
        } catch (err: any) {
          if (err.response.status === 404) {
            set({ restaurant: null });
          }
          set({ loading: false });
        }
      },
      updateRestaurant: async (formData: FormData) => {
        try {
          set({ loading: true });
          const response = await axios.put(
            `${API_END_POINT}/update`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            }
          );
          if (response.data.success) {
            toast.success(response.data.message);
            set({ loading: false });
          }
        } catch (err: any) {
          toast.error(
            err.response.data.message || "Restaurant updation failed"
          );
          set({ loading: false });
        }
      },
      getSingleRestaurant: async (restaurantId: string) => {
        try {
          set({ loading: true });
          const response = await axios.get(`${API_END_POINT}/${restaurantId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.data.success) {
            console.log(response.data);
            set({ loading: false, singleRestaurant: response.data.restaurant });
          }
        } catch (err: any) {
          if (err.response.status === 404) {
            set({ restaurant: null });
          }
          set({ loading: false });
        }
      },
      searchRestaurant: async (searchQuery: string, selectedCuisines: any) => {
        try {
          set({ loading: true });
          const params = new URLSearchParams();
          // if (appliedFilter.length > 0) {
          //   params.append("selectedCuisines", appliedFilter.join(","));
          // }
          params.set("searchQuery", searchQuery);
          params.set("selectedCuisines", selectedCuisines.join(","));
          console.log("Token sent:", token);

          const response = await axios.get(
            `${API_END_POINT}/search/${searchQuery}?${params.toString()}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.data.success) {
            console.log(response.data);
            set({
              loading: false,
              searchedRestaurant: response.data,
            });
          }
        } catch (err) {
          console.log(err);
          set({ loading: false });
        }
      },
      addMenuToRestaurant: (menu: MenuItems) => {
        set((state: any) => ({
          restaurant: state.restaurant
            ? { ...state.restaurant, menus: [...state.restaurant.menus, menu] }
            : null,
        }));
      },
      updateMenuToRestaurant: (updatedMenu: MenuItems) => {
        set((state: any) => {
          if (state.restaurant) {
            const updatedMenuList = state.restaurant.menus.map((menu: any) =>
              menu._id === updatedMenu._id ? updatedMenu : menu
            );
            return {
              restaurant: {
                ...state.restaurant,
                menus: updatedMenuList,
              },
            };
          }
          return state;
        });
      },
      setAppliedFilter: (value: string) => {
        if (!value.trim()) return;
        set((state) => {
          const isAlreadyApplied = state.appliedFilter.includes(value);
          const updatedFilter = isAlreadyApplied
            ? state.appliedFilter.filter((item) => item !== value)
            : [...state.appliedFilter, value];
          return { appliedFilter: updatedFilter };
        });
      },
      resetAppliedFilter: () => {
        set((state) =>
          state.appliedFilter.length > 0 ? { appliedFilter: [] } : state
        );
      },
      getRestaurantOrder: async () => {
        try {
          set({ loading: true });
          const response = await axios.get(`${API_END_POINT}/order`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.data.success) {
            set({ loading: false, restaurantOrders: response.data.orders });
          }
        } catch (err) {
          console.log(err);
          set({ loading: false });
        }
      },
      updateRestaurantOrder: async (orderId: string, status: string) => {
        try {
          const response = await axios.put(
            `${API_END_POINT}/order/${orderId}/status`,
            { status },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (response.data.success) {
            const updatedOrder = get().restaurantOrders.map((order: Orders) => {
              return order._id === orderId
                ? { ...order, status: response.data.status }
                : order;
            });
            set({ restaurantOrders: updatedOrder });
            toast.success(response.data.message);
          }
        } catch (err: any) {
          toast.error(err.response.data.message);
        }
      },
    }),

    {
      name: "restaurant-name",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
