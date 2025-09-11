import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRestaurantStore } from "@/store/useRestaurantStore";
import { useEffect } from "react";

export const OrderStatusOptions = [
  { id: 1, status: "Pending" },
  { id: 2, status: "Confirmed" },
  { id: 3, status: "Preparing" },
  { id: 4, status: "OutForDelivery" },
  { id: 5, status: "Delivered" },
  { id: 6, status: "Cancelled" },
];

const Orders = () => {
  const { getRestaurantOrder, restaurantOrders } = useRestaurantStore();

  useEffect(() => {
    console.log(restaurantOrders);
    getRestaurantOrder();
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <h1 className="text-xl md:text-3xl font-extrabold text-gray-900 dark:text-white mb-10">
        Orders Overview
      </h1>
      <div className="space-y-8">
        {restaurantOrders.map((order) => (
          <div
            key={order._id}
            className="flex flex-col md:flex-row justify-between items-start bg-white dark:bg-gray-800 shadow-lg rounded-xl
        p-6 sm:p-8 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex-1 mb-6 sm:mb-0">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {order.deliveryDetails.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                <span className="font-semibold">Address:</span>
                {order.deliveryDetails.address}
              </p>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                <span className="font-semibold">Total Amount:</span>₹{" "}
                {order.totalAmount / 100}
              </p>
            </div>
            <div className="w-full sm:w-1/3">
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Order Status
              </Label>
              <Select defaultValue={order.status}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {OrderStatusOptions.map((option) => (
                      <div>
                        <SelectItem
                          key={option.id}
                          value={option.status.toLowerCase()}
                        >
                          {option.status}
                        </SelectItem>
                      </div>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
