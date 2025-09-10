import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useRestaurantStore } from "@/store/useRestaurantStore";
import { useState } from "react";

export interface FilterOptionsState {
  id: string;
  label: string;
}

const filterOptions: FilterOptionsState[] = [
  {
    id: "gravy",
    label: "Gravy",
  },
  {
    id: "fish",
    label: "Fish",
  },
  {
    id: "briyani",
    label: "Briyani",
  },
  {
    id: "burger",
    label: "Burger",
  },
];

const FilteredPage = () => {
  const { setAppliedFilter, appliedFilter, resetAppliedFilter } =
    useRestaurantStore();
  // const [selectedId, setSelectedId] = useState<string | null>(null);
  const appliedFilterHandler = (value: string) => {
    setAppliedFilter(value);
  };
  return (
    <div className="md:w-72">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-lg">Filter By Cuisines</h1>
        <Button variant={"link"} onClick={resetAppliedFilter}>
          Reset
        </Button>
      </div>
      {filterOptions.map((option) => (
        <div
          key={option.id}
          className="flex items-center gap-2  space-x-2 my-4"
        >
          <Checkbox
            id={option.id}
            checked={appliedFilter.includes(option.label)}
            className="size-4 border border-gray-400"
            onCheckedChange={() => appliedFilterHandler(option.label)}
          />
          <Label className="text-sm font-medium peer-disabled:opacity-70 leading-none peer-disabled:cursor-not-allowed">
            {" "}
            {option.label}
          </Label>
        </div>
      ))}
    </div>
  );
};

export default FilteredPage;
