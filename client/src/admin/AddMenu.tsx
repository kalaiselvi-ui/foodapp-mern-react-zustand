import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EditMenu from "@/admin/EditMenu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MenuCard from "@/components/ui/MenuCard";
import { menuSchema, type MenuFormSchema } from "@/schema/menuSchema";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import type { MenuFormErrors } from "@/components/ui/types";
import { useMenuStore } from "@/store/useMenuStore";
import { useRestaurantStore } from "@/store/useRestaurantStore";

const AddMenu = () => {
  const [addMenuInput, setAddMenuInput] = useState<MenuFormSchema>({
    title: "",
    description: "",
    price: 0,
    imageFile: undefined,
  });
  const [open, setOpen] = useState<boolean>(false);
  const [error, setError] = useState<Partial<MenuFormErrors>>({});
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const { loading, createMenu } = useMenuStore();
  const { restaurant } = useRestaurantStore();
  const [selectedMenu, setSelectedMenu] = useState<any>();

  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setAddMenuInput({
      ...addMenuInput,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
          formData.append("imageFile", value); // append file only once
        } else if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      // if (addMenuInput.imageFile) {
      //   formData.append("imageFile", addMenuInput.imageFile);
      // }
      await createMenu(formData);
      setOpen(false); // ✅ close modal
      setAddMenuInput({
        title: "",
        description: "",
        price: 0,
        imageFile: undefined,
      });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="max-w-6xl mx-auto my-10">
      <div className="flex justify-between">
        <h1 className="font-bold md:font-extrabold text-lg md:text-2xl">
          Available Menus
        </h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              {" "}
              Add Menu
              <Plus className="mr-2" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add A New Menu</DialogTitle>
              <DialogDescription>
                Create a menu that will make your restaurant stand out
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
                  <span className="text-sm text-red-500">
                    {error.description}
                  </span>
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
                  onChange={(e) => {
                    setAddMenuInput({
                      ...addMenuInput,
                      imageFile: e.target.files?.[0] || undefined,
                    });
                    setError((prev) => ({ ...prev, imageFile: undefined }));
                  }}
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
      </div>
      <div className="flex flex-col gap-4 w-full mt-10">
        {restaurant?.menus?.map((item: any, index) => (
          <MenuCard
            key={index}
            title={item.title}
            description={item.description}
            price={item.price}
            image={item.imageFile}
            buttonText="Edit"
            layout="row"
            onButtonClick={() => {
              setSelectedMenu(item);
              setEditOpen(true);
              console.log(index);
            }}
          />
        ))}
      </div>
      {selectedMenu && (
        <EditMenu
          selectedMenu={selectedMenu}
          editOpen={editOpen}
          setEditOpen={setEditOpen}
        />
      )}
    </div>
  );
};

export default AddMenu;
