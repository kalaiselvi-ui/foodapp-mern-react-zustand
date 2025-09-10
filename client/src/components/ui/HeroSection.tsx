import { useState } from "react";
import { Input } from "./input";
import { Search } from "lucide-react";
import { Button } from "./button";
import HeroImage from "@/assets/hero_pizza.png";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [searchText, setSearchText] = useState<string>("");
  const navigate = useNavigate();
  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto rounded-lg gap-20 flex-grow">
      <div className="flex flex-col gap-10 md:w-1/2 justify-center md:mt-0 mt-5">
        <div className="flex flex-col gap-5">
          <h1 className="font-bold md:font-extrabold md:text-4xl text-3xl">
            Order Food anytime & anywhere
          </h1>
          <p className="text-gray-500">
            Hey! our delicious food is waiting for you, we are always near to
            you.
          </p>
        </div>
        <div className="relative flex items-center gap-2">
          <Input
            type="text"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value), console.log(searchText);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); // stop form submission/reload
                navigate(`/search/${searchText}`);
              }
            }}
            placeholder="Search by restaurant & cusines"
            className="shadow-xl indent-7"
          />
          <Search className="absolute left-2 inset-y-1.5 text-gray-500" />
          <Button onClick={() => navigate(`/search/${searchText}`)}>
            Search
          </Button>
        </div>
      </div>
      <div className="md:w-1/2 flex justify-center items-center">
        <img src={HeroImage} alt="" className="w-full object-cover h-auto" />
      </div>
    </div>
  );
};

export default HeroSection;
