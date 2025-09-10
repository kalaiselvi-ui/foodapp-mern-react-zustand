import AvailableMenu from "@/components/ui/AvailableMenu";
import { Badge } from "@/components/ui/badge";
import { useRestaurantStore } from "@/store/useRestaurantStore";
import { Timer } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
const RestaurantDetails = () => {
  const params = useParams();
  const { getSingleRestaurant, singleRestaurant } = useRestaurantStore();

  useEffect(() => {
    if (params.id) {
      getSingleRestaurant(params.id);
    }
  }, [params.id]);
  return (
    <div className="max-w-6xl mx-auto my-10">
      <div className="w-full">
        <div className="relative w-full h-32 min-h-64 lg:h-72">
          <img
            src={
              singleRestaurant?.imageUrl ||
              "https://www.pittsburghmagazine.com/content/uploads/2025/01/q/j/bombay-to-burgh-photo-courtesy-of-restaurant.jpeg"
            }
            alt=""
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="flex flex-col md:flex-row justify-between">
          <div className="my-5">
            <h1 className="font-medium text-xl">
              {singleRestaurant?.restaurantName}
            </h1>
            <div className="flex gap-2 my-2">
              {singleRestaurant?.cuisines.map(
                (cuisine: string, idx: number) => (
                  <Badge key={idx}>{cuisine}</Badge>
                )
              )}
            </div>
            <div className="flex md:flex-row flex-col gap-2 my-5">
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5" />
                <h3 className="flex items-center gap-2 font-medium">
                  Delivery Time: {""}{" "}
                  <span className="text-[#D19254]">
                    {" "}
                    {singleRestaurant?.deliveryTime} mins
                  </span>
                </h3>
              </div>
            </div>
          </div>
        </div>
        <AvailableMenu menus={singleRestaurant?.menus} />
      </div>
    </div>
  );
};

export default RestaurantDetails;
