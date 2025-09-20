import { IndianRupee } from "lucide-react";
import { Separator } from "./separator";
import { Link } from "react-router-dom";
import { Button } from "./button";
import { useOrderStore } from "@/store/useOrderStore";
import { useEffect } from "react";
import type { Orders } from "./types";
import { useCartStore } from "@/store/useCartStore";
const Success = () => {
  const { orders, getOrderDetails } = useOrderStore();
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    getOrderDetails();
    console.log(orders);
    clearCart();
  }, [getOrderDetails, clearCart]);

  if (orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[90vh]">
        <h3 className="font-bold text-2xl text-gray-700 dark:text-gray-300">
          Order Not Found!
        </h3>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-gray-50 dark:bg-gray-900 px-4 ">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg w-full p-6 max-w-lg">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Order Status: {""}
            <span className="text-[#FF5A5A]">{"confirm".toUpperCase()}</span>
          </h1>
        </div>
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Order Summary
          </h2>
          {orders.map((order: Orders, index) => (
            <div key={index}>
              {order.cartItems.map((item) => (
                <div className="mb-4" key={item.menuId}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <img
                        src={item.image}
                        alt=""
                        className="w-14 h-14 rounded-md object-contain"
                      />
                      <h3 className="text-gray-800 dark:text-gray-200 font-medium">
                        {item.name}
                      </h3>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-800 dark:text-gray-200 flex items-center">
                        <IndianRupee />
                        <span className="text-lg font-medium">
                          {item.price}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Separator className="my-4" />
                </div>
              ))}
            </div>
          ))}
        </div>
        <Link to="/cart">
          <Button className="w-full py-3 rounded-md shadow-lg">
            Continue Shipping
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Success;
