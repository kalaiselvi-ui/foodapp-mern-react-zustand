import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import axios from "axios";
import type { LoginInputState, SignupInputState } from "@/schema/userSchema";
import { toast } from "sonner";

const API_END_POINT = import.meta.env.VITE_END_POINT || "http://localhost:9000";
axios.defaults.withCredentials = true;

type User = {
  _id: string;
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
  token: string; // store token here
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
    (set, get) => ({
      user: null,
      token: localStorage.getItem("token") || "", // load token from localStorage
      isAuth: false,
      isCheckingAuth: true,
      loading: false,

      // SIGNUP
      signup: async (input: SignupInputState) => {
        set({ loading: true });
        try {
          const response = await axios.post(
            `${API_END_POINT}/api/user/signup`,
            input,
            {
              headers: { "Content-Type": "application/json" },
            }
          );

          if (response.data.success) {
            localStorage.setItem("token", response.data.token); // save token
            set({
              loading: false,
              user: response.data.user,
              isAuth: true,
              token: response.data.token,
            });
            toast.success(response.data.message);
          }
        } catch (err: any) {
          set({ loading: false });
          toast.error(err.response?.data?.message || "Signup failed");
        }
      },

      // LOGIN
      login: async (input: LoginInputState) => {
        set({ loading: true });
        try {
          const response = await axios.post(
            `${API_END_POINT}/api/user/login`,
            input,
            {
              headers: { "Content-Type": "application/json" },
            }
          );

          if (response.data.success) {
            localStorage.setItem("token", response.data.token); // save token
            set({
              loading: false,
              user: response.data.user,
              isAuth: true,
              token: response.data.token, // store token in Zustand memory
            });
            toast.success(response.data.message);
          }
        } catch (err: any) {
          set({ loading: false });
          toast.error(err.response?.data?.message || "Login failed");
        }
      },

      // VERIFY EMAIL
      verifyEmail: async (verificationCode: string) => {
        set({ loading: true });
        const token = get().token;
        if (!token) {
          toast.error("Login required");
          return; // just exit, don't return a value
        }

        try {
          const response = await axios.post(
            `${API_END_POINT}/api/user/verify-email`,
            { verificationCode },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.data.success) {
            set({
              loading: false,
              user: response.data.user,
              isAuth: true,
            });
            toast.success(response.data.message);
          }
        } catch (err: any) {
          set({ loading: false });
          toast.error(err.response?.data?.message || "Verification failed");
        }
      },

      // CHECK AUTH
      checkAuthentication: async () => {
        try {
          set({ isCheckingAuth: true });
          const token = get().token;
          if (!token) throw new Error("No token");

          const response = await axios.get(
            `${API_END_POINT}/api/user/check-auth`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (response.data.success) {
            set({
              user: response.data.user,
              isAuth: true,
              isCheckingAuth: false,
            });
          }
        } catch (err: any) {
          set({ isAuth: false, isCheckingAuth: false, user: null, token: "" });
          localStorage.removeItem("token");
          toast.error(err.response?.data?.message || "Authentication failed");
        }
      },

      // LOGOUT
      logout: async () => {
        set({ loading: true });
        try {
          const token = get().token;
          await axios.post(
            `${API_END_POINT}/api/user/logout`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          set({ loading: false, user: null, isAuth: false, token: "" });
          localStorage.removeItem("token");
          toast.success("Logged out successfully");
        } catch (err: any) {
          set({ loading: false });
          toast.error(err.response?.data?.message || "Logout failed");
        }
      },

      // FORGOT PASSWORD
      forgotPassword: async (email: string) => {
        try {
          set({ loading: true });
          const response = await axios.post(
            `${API_END_POINT}/api/user/forgot-password`,
            { email }
          );
          if (response.data.success) toast.success(response.data.message);
        } catch (err: any) {
          toast.error(err.response?.data?.message || "Request failed");
        } finally {
          set({ loading: false });
        }
      },

      // RESET PASSWORD
      resetPassword: async (newPassword: string, tokenParam: string) => {
        try {
          set({ loading: true });
          const response = await axios.post(
            `${API_END_POINT}/api/user/reset-password/${tokenParam}`,
            { newPassword }
          );
          if (response.data.success) toast.success(response.data.message);
        } catch (err: any) {
          toast.error(err.response?.data?.message || "Reset failed");
        } finally {
          set({ loading: false });
        }
      },

      // UPDATE PROFILE
      updateProfile: async (profileData: any) => {
        const token = get().token;
        if (!token) {
          toast.error("Login required");
          return; // just exit, don't return a value
        }
        try {
          const response = await axios.put(
            `${API_END_POINT}/api/user/profile/update`,
            profileData,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (response.data.success) {
            set({ user: response.data.user, isAuth: true });
            toast.success(response.data.message);
          }
        } catch (err: any) {
          toast.error(err.response?.data?.message || "Update failed");
        }
      },
    }),
    {
      name: "user-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
