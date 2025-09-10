import { z } from "zod";

export const menuSchema = z.object({
  title: z.string().nonempty({ message: "Title is required" }),
  description: z.string().nonempty({ message: "description is required" }),
  price: z.number().min(0, { message: "Price can not be negative" }),
  imageFile: z
    .union([z.instanceof(File), z.string().url()])
    .optional()
    .refine(
      (fileOrUrl) => {
        if (!fileOrUrl) return false; // fail if undefined
        if (fileOrUrl instanceof File) return fileOrUrl.size > 0; // check file size
        return true; // if it's a string URL, it's valid
      },
      { message: "Image file is required" }
    ),
});

export type MenuFormSchema = z.infer<typeof menuSchema>;

export type Menu = {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageFile: string;
};
