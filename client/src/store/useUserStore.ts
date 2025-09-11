import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import axios from "axios";
import type { LoginInputState, SignupInputState } from "@/schema/userSchema";
import { toast } from "sonner";

const API_END_POINT = "https://food-app-server-two-77.vercel.app/api/user";
axios.defaults.withCredentials = true;
const token = localStorage.getItem("token"); // JWT stored at login

type User = {
  name: string;
  email: string;
  address: string;
  city: string;
  country: string;
  profilePicture: string;
  admin: boolean;
  isVerified: boolean;
};

type UserState = {
  user: User | null;
  isAuth: boolean;
  isCheckingAuth: boolean;
  loading: boolean;
  signup: (input: SignupInputState) => Promise<void>;
  login: (input: LoginInputState) => Promise<void>;
  logout: () => Promise<void>;
  verifyEmail: (verificationCode: string) => Promise<void>;
  checkAuthentication: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  updateProfile: (profileData: any) => Promise<void>;
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuth: false,
      isCheckingAuth: true,
      loading: false,

      // signup api
      signup: async (input: SignupInputState) => {
        set({ loading: true });
        try {
          const response = await axios.post(`${API_END_POINT}/signup`, input, {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          });
          if (response.data.success) {
            toast.success(response.data.message);
            set({
              loading: false,
              user: response.data.user,
              isAuth: true,
            });
          }
        } catch (err: any) {
          set({ loading: false });
          toast.error(err.response?.data?.message || "Signup failed");
        }
      },

      // login api
      login: async (input: LoginInputState) => {
        set({ loading: true });
        try {
          const response = await axios.post(`${API_END_POINT}/login`, input, {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          });
          if (response.data.success) {
            localStorage.setItem("token", response.data.token);

            toast.success(response.data.message);
            set({
              loading: false,
              user: response.data.user,
              isAuth: true,
            });
          }
        } catch (err: any) {
          set({ loading: false });
          toast.error(err.response?.data?.message || "Login failed");
        }
      },

      // verify email api
      verifyEmail: async (verificationCode: string) => {
        set({ loading: true });
        try {
          const response = await axios.post(
            `${API_END_POINT}/verify-email`,
            { verificationCode },
            { headers: { "Content-Type": "application/json" } }
          );
          if (response.data.success) {
            toast.success(response.data.message);
            set({
              loading: false,
              user: response.data.user,
              isAuth: true,
            });
          }
        } catch (err: any) {
          set({ loading: false });
          toast.error(err.response?.data?.message || "Verification failed");
        }
      },

      // check auth api
      checkAuthentication: async () => {
        try {
          set({ isCheckingAuth: true });
          const token = localStorage.getItem("token"); // get latest token

          const response = await axios.get(`${API_END_POINT}/check-auth`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.data.success) {
            set({
              user: response.data.user,
              isAuth: true,
              isCheckingAuth: false,
            });
          }
        } catch (err: any) {
          set({
            isAuth: false,
            isCheckingAuth: false,
            user: null,
          });
          toast.error(err.response?.data?.message || "Authentication failed");
        }
      },

      // logout api
      logout: async () => {
        set({ loading: true });
        try {
          const response = await axios.post(`${API_END_POINT}/logout`);
          if (response.data.success) {
            set({
              loading: false,
              isAuth: false,
              user: null,
            });
            localStorage.removeItem("user-name");
            toast.success(response.data.message);
          }
        } catch (err: any) {
          set({ loading: false });
          toast.error(err.response?.data?.message || "Logout failed");
        }
      },

      // forgot password api
      forgotPassword: async (email: string) => {
        try {
          set({ loading: true });
          const response = await axios.post(
            `${API_END_POINT}/forgot-password`,
            { email }
          );
          if (response.data.success) {
            set({ loading: false });
            toast.success(response.data.message);
          }
        } catch (err: any) {
          set({ loading: false });
          toast.error(err.response?.data?.message || "Request failed");
        }
      },

      // reset password api
      resetPassword: async (newPassword: string, token: string) => {
        try {
          set({ loading: true });
          const response = await axios.post(
            `${API_END_POINT}/reset-password/${token}`,
            { newPassword }
          );
          if (response.data.success) {
            set({ loading: false });
            toast.success(response.data.message);
          }
        } catch (err: any) {
          set({ loading: false });
          toast.error(err.response?.data?.message || "Reset failed");
        }
      },

      // update profile api
      updateProfile: async (profileData: any) => {
        try {
          const response = await axios.put(
            `${API_END_POINT}/profile/update`,
            profileData
          );
          console.log("API RESPONSE:", response.data);

          if (response.data.success) {
            set(() => ({
              isAuth: true,
              user: response.data.user, // ✅ update user
            }));
            toast.success(response.data.message);
          }
        } catch (err: any) {
          toast.error(err.response?.data?.message || "Update failed");
        }
      },
    }),
    {
      name: "user-name", // key in localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
