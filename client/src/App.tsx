import Login from "./auth/Login";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Signup from "./auth/Signup";
import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";
import HeroSection from "./components/ui/HeroSection";
import Profile from "./pages/Profile";
import SearchPage from "./pages/SearchPage";
import RestaurantDetails from "./pages/RestaurantDetails";
import Cart from "./pages/Cart";
import Restaurant from "./admin/Restaurant";
import AddMenu from "./admin/AddMenu";
import Orders from "./admin/Orders";
import Success from "./components/ui/Success";
import { useUserStore } from "./store/useUserStore";
import { useEffect } from "react";
import Loading from "./components/Loading";
import { useThemeStore } from "./store/useThemeStore";

const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  const { isAuth, isCheckingAuth } = useUserStore();

  if (isCheckingAuth) {
    // show loader while checking auth
    return <div>Loading...</div>;
  }

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  // if (isAuth && !user?.isVerified) {
  //   return <Navigate to="/verify-email" replace />;
  // }
  return children;
};

const AuthenticatedRoutes = ({ children }: { children: React.ReactNode }) => {
  const { isAuth, isCheckingAuth } = useUserStore();
  if (isCheckingAuth) {
    return <Loading />;
  }
  if (isAuth) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuth, user } = useUserStore();

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  if (!user?.admin) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoutes>
        <MainLayout />
      </ProtectedRoutes>
    ),
    children: [
      {
        path: "/",
        element: <HeroSection />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/search/:id",
        element: <SearchPage />,
      },
      {
        path: "/restaurant/:id",
        element: <RestaurantDetails />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/order/status",
        element: <Success />,
      },
      //admin services
      {
        path: "/admin/restaurant",
        element: (
          <AdminRoute>
            <Restaurant />
          </AdminRoute>
        ),
      },
      {
        path: "/admin/menu",
        element: (
          <AdminRoute>
            <AddMenu />
          </AdminRoute>
        ),
      },
      {
        path: "/admin/orders",
        element: (
          <AdminRoute>
            <Orders />
          </AdminRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: (
      <AuthenticatedRoutes>
        <Login />
      </AuthenticatedRoutes>
    ),
  },
  {
    path: "/signup",
    element: (
      <AuthenticatedRoutes>
        <Signup />
      </AuthenticatedRoutes>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <AuthenticatedRoutes>
        <ForgotPassword />
      </AuthenticatedRoutes>
    ),
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  // {
  //   path: "/verify-email",
  //   element: <VerifyEmail />,
  // },
]);

function App() {
  const { checkAuthentication, isCheckingAuth } = useUserStore();
  const initializeTheme = useThemeStore((state: any) => state.initializeTheme);

  useEffect(() => {
    checkAuthentication();
    initializeTheme();
  }, [checkAuthentication]);

  if (isCheckingAuth) return <Loading />;
  return (
    <main className="">
      <RouterProvider router={appRouter}></RouterProvider>
    </main>
  );
}

export default App;
