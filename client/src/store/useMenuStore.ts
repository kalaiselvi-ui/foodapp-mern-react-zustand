import type { MenuFormSchema } from "@/schema/menuSchema";
import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useRestaurantStore } from "./useRestaurantStore";

const API_END_POINT = "http://localhost:9000/api/menu";
axios.defaults.withCredentials = true;

type menuState = {
  menu: null;
  loading: boolean;
  createMenu: (formData: FormData) => Promise<void>;
  editMenu: (menuId: string, formData: FormData) => Promise<void>;
};

export const useMenuStore = create<menuState>()(
  persist(
    (set) => ({
      menu: null,
      loading: false,
      createMenu: async (formData: FormData) => {
        try {
          set({ loading: true });
          const response = await axios.post(`${API_END_POINT}/add`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          });
          if (response.data.success) {
            toast.success(response.data.message);
            set({ loading: false, menu: response.data.menu });
          }
          //update restaurant
          useRestaurantStore.getState().addMenuToRestaurant(response.data.menu);
        } catch (err: any) {
          console.log(err);
          toast.error(err.response.data.message);
          set({ loading: false });
        }
      },
      editMenu: async (menuId: string, formData: FormData) => {
        try {
          set({ loading: true });
          const response = await axios.put(
            `${API_END_POINT}/edit/${menuId}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              withCredentials: true,
            }
          );
          if (response.data.success) {
            toast.success(response.data.message);
            set({ loading: false, menu: response.data.menu });
          }
          useRestaurantStore
            .getState()
            .updateMenuToRestaurant(response.data.menu);
        } catch (err: any) {
          console.log(err);
          toast.error(err.response.data.message);
          set({ loading: false });
        }
      },
    }),

    {
      name: "menu-name",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
