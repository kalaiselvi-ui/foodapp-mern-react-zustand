import { Button } from "./button";
import { Card, CardContent, CardFooter } from "./card";
import type { MenuCardProps } from "./types";

// interface MenuCardProps {
//   title: string;
//   description: string;
//   price: number | string;
//   image: File | undefined;
//   buttonText?: string;
//   onButtonClick?: () => void;
// }
const MenuCard = ({
  title,
  description,
  price,
  image,
  buttonText,
  onButtonClick,
  layout = "col",
}: MenuCardProps) => {
  return (
    <Card
      className={`md:max-w-xs mx-auto shadow-lg rounded-lg overflow-hidden py-0 flex ${
        layout == "row"
          ? "md:flex-row w-full md:max-w-4xl max-w-3xl mx-0"
          : "flex-col md:max-w-xs mx-auto"
      }`}
    >
      {/* <img
        src={image instanceof File ? URL.createObjectURL(image) : image || ""}
        alt={title}
        className="w-full h-40 object-cover"
      /> */}
      <img
        src={image instanceof File ? URL.createObjectURL(image) : image || ""}
        alt={title}
        className={
          layout === "row"
            ? "md:w-32 md:h-32 object-cover flex-shrink-0 rounded-l-lg" // small fixed size for row
            : "w-full h-40 object-cover" // full width for col
        }
      />
      <CardContent className="px-4 pt-4 flex-1">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          {title}
        </h2>
        <p className="text-sm text-gray-600 mt-2">{description}</p>
        <h3 className="text-lg font-semibold mt-4">
          Price: <span className="text-[#D19254]">₹ {price}</span>
        </h3>
      </CardContent>
      <CardFooter className="px-4 pb-4">
        <Button className="w-full" onClick={onButtonClick}>
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MenuCard;
