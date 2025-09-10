import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  restaurantAddSchema,
  type RestaurantFormState,
} from "@/schema/restaurantSchema";
import { useRestaurantStore } from "@/store/useRestaurantStore";
import { Loader2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

const Restaurant = () => {
  const [input, setInput] = useState<RestaurantFormState>({
    restaurantName: "",
    city: "",
    country: "",
    deliveryTime: 0,
    cuisines: [],
    imageFile: undefined,
  });

  type RestaurantFormErrors = Partial<
    Record<keyof RestaurantFormState, string>
  >;

  const [error, setError] = useState<RestaurantFormErrors>({});
  const {
    loading,
    restaurant,
    updateRestaurant,
    createRestaurant,
    getRestaurant,
  } = useRestaurantStore();

  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setInput({ ...input, [name]: type === "number" ? Number(value) : value });
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = restaurantAddSchema.safeParse(input);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof RestaurantFormState, string>> =
        {};

      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[
          issue.path.length - 1
        ] as keyof RestaurantFormState;
        fieldErrors[fieldName] = issue.message;
        console.log(result.error.issues);
      });

      setError(fieldErrors);
      return;
    }

    try {
      const formData = new FormData();

      Object.entries(input).forEach(([key, value]) => {
        if (key === "cuisines") {
          formData.append(key, JSON.stringify(value));
        } else if (key === "imageFile" && value) {
        } else if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      if (input.imageFile) {
        formData.append("imageFile", input.imageFile);
      }

      if (!input.imageFile) {
        setError((prev) => ({ ...prev, imageFile: "Image file is required" }));
        return;
      }

      if (restaurant) {
        await updateRestaurant(formData);
      } else {
        await createRestaurant(formData);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getRestaurant();
  }, []);

  useEffect(() => {
    if (restaurant) {
      setInput({
        ...restaurant,
        imageFile: undefined,
      });
    }
    console.log(restaurant);
  }, [restaurant]);

  return (
    <div className="max-w-6xl mx-auto my-10">
      <div>
        <div>
          <h1 className="font-extrabold text-2xl mb-5">Add Restaurant</h1>
          <form onSubmit={submitHandler}>
            <div className="md:grid grid-cols-2 gap-6 space-y-2 md:space-y-0">
              <div>
                <Label>Restaurant Name</Label>
                <Input
                  type="text"
                  name="restaurantName"
                  value={input.restaurantName}
                  onChange={changeEventHandler}
                  placeholder="Enter your restaurant name"
                />
                {error && (
                  <span className="text-sm text-red-500">
                    {error.restaurantName}
                  </span>
                )}
              </div>
              <div>
                <Label>City</Label>
                <Input
                  type="text"
                  name="city"
                  value={input.city}
                  onChange={changeEventHandler}
                  placeholder="Enter your city name"
                />
                {error && (
                  <span className="text-sm text-red-500">{error.city}</span>
                )}
              </div>
              <div>
                <Label>Country</Label>
                <Input
                  type="text"
                  name="country"
                  value={input.country}
                  onChange={changeEventHandler}
                  placeholder="Enter your country name"
                />
                {error && (
                  <span className="text-sm text-red-500">{error.country}</span>
                )}
              </div>
              <div>
                <Label>Delivery Time</Label>
                <Input
                  type="number"
                  name="deliveryTime"
                  value={input.deliveryTime}
                  onChange={changeEventHandler}
                  placeholder="Enter your delivery time"
                />
                {error && (
                  <span className="text-sm text-red-500">
                    {error.deliveryTime}
                  </span>
                )}
              </div>
              <div>
                <Label>Cuisines</Label>
                <Input
                  type="text"
                  name="cuisines"
                  value={input.cuisines}
                  onChange={(e) =>
                    setInput({ ...input, cuisines: e.target.value.split(",") })
                  }
                  placeholder="eg. Briyani, Sweets"
                />
                {error && (
                  <span className="text-sm text-red-500">{error.cuisines}</span>
                )}
              </div>
              <div>
                <Label>Upload Restaurant Banner</Label>
                <Input
                  type="file"
                  accept="image/*"
                  name="imageFile"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    setInput({ ...input, imageFile: file || undefined });
                    setError((prev) => ({ ...prev, imageFile: undefined }));
                  }}
                />
                {error.imageFile && (
                  <span className="text-sm text-red-500">
                    {error.imageFile}
                  </span>
                )}
              </div>
            </div>
            <div className="my-5 w-fit">
              {loading ? (
                <Button disabled className="w-full">
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button className="">
                  {restaurant
                    ? "Update your Restaurant"
                    : "Add your Restaurant"}{" "}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Restaurant;
