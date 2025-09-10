export interface MenuCardProps {
  title: string;
  description: string;
  price: number | string;
  image?: string | File | undefined;
  buttonText?: string;
  onButtonClick?: () => void;
  layout?: "row" | "col";
}

export interface MenuFormState {
  title: string;
  description: string;
  price: number | string;
  image?: string | File | undefined;
}

export interface MenuFormErrors {
  title?: string;
  description?: string;
  price?: string;
  imageFile?: string;
}

export interface MenuItems {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageFile: string;
}

export type Restaurant = {
  _id: string;
  user: string;
  restaurantName: string;
  city: string;
  country: string;
  deliveryTime: number;
  cuisines: string[];
  imageUrl?: string;
  menus?: MenuItems[];
};
export type searchedRestaurant = {
  data: Restaurant[];
};

export type RestaurantState = {
  loading: boolean;
  restaurant: Restaurant | null;
  singleRestaurant?: Restaurant | null;
  searchedRestaurant?: searchedRestaurant | null;
  appliedFilter: string[];
  restaurantOrders: Orders[];
  createRestaurant: (formData: FormData) => Promise<void>;
  updateRestaurant: (formData: FormData) => Promise<void>;
  getRestaurant: () => Promise<void>;
  addMenuToRestaurant: (menu: MenuItems) => void;
  updateMenuToRestaurant: (updatedMenu: MenuItems) => void;
  getSingleRestaurant: (restaurantId: string) => Promise<void>;
  setAppliedFilter: (value: string) => void;
  resetAppliedFilter: () => void;
  searchRestaurant: (
    searchQuery: string,
    selectedCuisines: string[]
  ) => Promise<void>;
  getRestaurantOrder: () => Promise<void>;
  updateRestaurantOrder: (orderId: string, status: string) => Promise<void>;
};

export interface CartItem extends MenuItems {
  quantity: number;
}

export type CartState = {
  cart: CartItem[];
  addToCart: (item: MenuItems) => void;
  clearCart: () => void;
  removeFromTheCart: (id: string) => void;
  incrementQuantity: (id: string) => void;
  decrementQuantity: (id: string) => void;
};

export type CheckoutSessionRequest = {
  cartItems: {
    menuId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
  }[];
  deliveryDetails: {
    name: string;
    email: string;
    address: string;
    city: string;
    country: string;
    contact: string;
  };
  restaurantId: string;
};

export interface Orders extends CheckoutSessionRequest {
  _id: string;
  status: string;
  totalAmount: number;
}

export type OrderState = {
  loading: boolean;
  orders: Orders[];
  createCheckOutSession: (
    checkoutSessionRequest: CheckoutSessionRequest
  ) => Promise<void>;
  getOrderDetails: () => Promise<void>;
};
