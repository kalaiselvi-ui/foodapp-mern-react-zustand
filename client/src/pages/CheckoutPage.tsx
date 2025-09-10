import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CheckoutSessionRequest } from "@/components/ui/types";
import { useCartStore } from "@/store/useCartStore";
import { useOrderStore } from "@/store/useOrderStore";
import { useRestaurantStore } from "@/store/useRestaurantStore";
import { useUserStore } from "@/store/useUserStore";
import { Dialog } from "@radix-ui/react-dialog";
import {
  useState,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from "react";

const CheckoutPage = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { user } = useUserStore();
  const [input, setInput] = useState({
    name: user?.name || "",
    email: user?.email || "",
    contact: user?.country || "",
    address: user?.address || "",
    city: user?.city || "",
    country: user?.country || "",
  });
  const { restaurant } = useRestaurantStore();
  const { cart } = useCartStore();
  const { createCheckOutSession } = useOrderStore();
  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };
  const checkoutHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const checkOutData: CheckoutSessionRequest = {
        cartItems: cart.map((cartItem) => ({
          menuId: cartItem._id,
          name: cartItem.title,
          image: cartItem.imageFile,
          price: cartItem.price,
          quantity: cartItem.quantity,
        })),
        deliveryDetails: input,
        restaurantId: restaurant?._id as string,
      };

      await createCheckOutSession(checkOutData);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle className="font-semibold">Review Your Order</DialogTitle>
        <DialogDescription className="text-xs ">
          Double check your delivery details and ensure everything is in order
          when you are ready, hit confirm button to finalize your order
        </DialogDescription>
        <form
          onSubmit={checkoutHandler}
          className="md:grid grid-cols-2 gap-2 space-y-1 md:space-y-0"
        >
          <div>
            <Label>Name</Label>
            <Input
              type="text"
              name="name"
              value={input.name}
              onChange={changeEventHandler}
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
            />
          </div>
          <div>
            <Label>Contact</Label>
            <Input
              type="tel"
              name="contact"
              value={input.contact}
              onChange={changeEventHandler}
            />
          </div>
          <div>
            <Label>Address</Label>
            <Input
              type="text"
              name="address"
              value={input.address}
              onChange={changeEventHandler}
            />
          </div>
          <div>
            <Label>City</Label>
            <Input
              type="text"
              name="city"
              value={input.city}
              onChange={changeEventHandler}
            />
          </div>
          <div>
            <Label>Country</Label>
            <Input
              type="text"
              name="country"
              value={input.country}
              onChange={changeEventHandler}
            />
          </div>
          <DialogFooter className="col-span-2 pt-5">
            <Button>Continue To Payment</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutPage;
