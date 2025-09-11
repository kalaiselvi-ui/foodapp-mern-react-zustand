import React, {
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Loader2 } from "lucide-react";
import {
  menuSchema,
  type MenuFormSchema,
  type Menu,
} from "@/schema/menuSchema";
import type { MenuFormErrors } from "@/components/ui/types";
import { useMenuStore } from "@/store/useMenuStore";

interface EditMenuProps {
  selectedMenu: Menu;
  editOpen: boolean;
  setEditOpen: Dispatch<SetStateAction<boolean>>;
}

const EditMenu = ({ selectedMenu, editOpen, setEditOpen }: EditMenuProps) => {
  const { loading, editMenu } = useMenuStore();

  // Form state for Zod validation
  const [addMenuInput, setAddMenuInput] = useState<MenuFormSchema>({
    title: "",
    description: "",
    price: 0,
    imageFile: undefined,
  });

  const [error, setError] = useState<Partial<MenuFormErrors>>({});

  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setAddMenuInput({
      ...addMenuInput,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form input with Zod
    const result = menuSchema.safeParse(addMenuInput);
    if (!result.success) {
      const fieldErrors: Partial<MenuFormErrors> = {};
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as keyof MenuFormSchema;
        fieldErrors[fieldName] = issue.message;
      });
      setError(fieldErrors);
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(addMenuInput).forEach(([key, value]) => {
        if (key === "imageFile" && value instanceof File) {
          formData.append("imageFile", value);
        } else if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      await editMenu(selectedMenu._id, formData);
      setEditOpen(false); // close dialog
    } catch (err) {
      console.log(err);
    }
  };

  // Populate form whenever selectedMenu changes
  useEffect(() => {
    if (selectedMenu) {
      const { title, description, price, imageFile } = selectedMenu;
      setAddMenuInput({ title, description, price, imageFile });
    }
  }, [selectedMenu]);
  return (
    <Dialog open={editOpen} onOpenChange={setEditOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Menu</DialogTitle>
          <DialogDescription>
            update your menu to keep your offerings fresh and exciting!{" "}
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={submitHandler}>
          <div>
            <Label>Name</Label>
            <Input
              type="text"
              name="title"
              placeholder="Enter menu name"
              onChange={changeEventHandler}
              value={addMenuInput.title}
            />
            {error && (
              <span className="text-sm text-red-500">{error.title}</span>
            )}
          </div>
          <div>
            <Label>Description</Label>
            <Input
              type="text"
              name="description"
              value={addMenuInput.description}
              onChange={changeEventHandler}
              placeholder="Enter menu description"
            />
            {error && (
              <span className="text-sm text-red-500">{error.description}</span>
            )}
          </div>
          <div>
            <Label>Price in (Rs)</Label>
            <Input
              type="number"
              name="price"
              value={addMenuInput.price}
              onChange={changeEventHandler}
              placeholder="Enter menu price"
            />
            {error && (
              <span className="text-sm text-red-500">{error.price}</span>
            )}
          </div>
          <div>
            <Label>Upload Menu Image</Label>
            <Input
              type="file"
              name="imageFile"
              accept="image/*"
              onChange={(e) =>
                setAddMenuInput({
                  ...addMenuInput,
                  imageFile: e.target.files?.[0] || undefined,
                })
              }
            />
            {error.imageFile && (
              <span className="text-sm text-red-500">
                {error.imageFile || "Image file is missing"}
              </span>
            )}
          </div>
          <DialogFooter className="mt-5">
            {loading ? (
              <Button disabled className="w-full">
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button className="w-full">Submit</Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMenu;
