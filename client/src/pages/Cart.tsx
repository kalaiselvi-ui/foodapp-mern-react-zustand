import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import CheckoutPage from "./CheckoutPage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCartStore } from "@/store/useCartStore";

const Cart = () => {
  const { removeFromTheCart, cart, decrementQuantity, incrementQuantity } =
    useCartStore();
  const [open, setOpen] = useState<boolean>(false);
  let totalAmout = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  return (
    <div className="flex flex-col my-10">
      <div className="flex justify-end">
        <Button>Clear All</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Items</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Subtotal</TableHead>
            <TableHead className="text-right">Remove</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cart.map((item) => (
            <TableRow key={item._id}>
              <TableCell>
                <Avatar>
                  <AvatarImage src={item.imageFile} />
                  <AvatarFallback>TS</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>{item.title}</TableCell>
              <TableCell>{item.price}</TableCell>
              <TableCell>
                <div className="w-fit flex items-center rounded-full border border-gray-100 dark:border-gray-800 shadow-md">
                  <Button
                    onClick={() => decrementQuantity(item._id)}
                    size={"icon"}
                    variant={"outline"}
                    className="rounded-full bg-gray-200"
                  >
                    <Minus />
                  </Button>
                  <Button size={"icon"} variant={"ghost"} className="font-bold">
                    {item.quantity}
                  </Button>
                  <Button
                    onClick={() => incrementQuantity(item._id)}
                    size={"icon"}
                    variant={"default"}
                    className="rounded-full"
                  >
                    <Plus />
                  </Button>
                </div>
              </TableCell>
              <TableCell>{item.price * item.quantity}</TableCell>
              <TableCell className="text-end">
                <Button
                  onClick={() => removeFromTheCart(item._id)}
                  size={"sm"}
                  className="bg-red-500 hover:bg-red-400"
                >
                  <Trash2 />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5}>Total</TableCell>
            <TableCell className="text-right text-2xl font-bold">
              {totalAmout}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <div className="flex justify-end my-5">
        <Button onClick={() => setOpen(true)}>Proceed To Checkout</Button>
      </div>
      <CheckoutPage open={open} setOpen={setOpen} />
    </div>
  );
};

export default Cart;
