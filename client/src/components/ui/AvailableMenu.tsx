import { useCartStore } from "@/store/useCartStore";
import MenuCard from "./MenuCard";
import type { MenuItems } from "./types";

const AvailableMenu = ({ menus }: { menus?: MenuItems[] }) => {
  const { addToCart } = useCartStore();

  return (
    <div className="md:p-4">
      <div className="md:grid md:grid-cols-3 lg:grid-cols-4 md:gap-6 space-y-3 md:space-y-0">
        {menus?.map((item, index) => (
          <MenuCard
            key={item._id ?? index}
            title={item.title}
            description={item.description}
            price={item.price}
            image={item.imageFile}
            buttonText="Add To Cart"
            onButtonClick={() => {
              addToCart(item);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AvailableMenu;
