import { file, z } from "zod";

export const restaurantAddSchema = z.object({
  restaurantName: z.string().min(3, { message: "Restaurant name is required" }),
  city: z.string().nonempty({ message: "City is required" }),
  country: z.string().nonempty({ message: "Country is required" }),
  deliveryTime: z
    .number()
    .min(0, { message: "Delivery Time can not be negative" }),
  cuisines: z.array(z.string()),
  imageFile: z
    .instanceof(File)
    .optional()
    .refine((file) => file?.size !== 0, { message: "Image file is required" }),
});

export type RestaurantFormState = z.infer<typeof restaurantAddSchema>;
