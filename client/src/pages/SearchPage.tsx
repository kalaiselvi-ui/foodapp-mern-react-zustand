import { Link, useNavigate, useParams } from "react-router-dom";
import FilteredPage from "./FilteredPage";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Globe, MapPin, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useRestaurantStore } from "@/store/useRestaurantStore";
import type { Restaurant } from "@/components/ui/types";

const SearchPage = () => {
  const { id } = useParams<{ id: string }>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate = useNavigate();
  const { searchRestaurant, searchedRestaurant, appliedFilter } =
    useRestaurantStore();

  // Step 1: Initialize searchQuery from URL once
  // useEffect(() => {
  //   if (id && !searchQuery) {
  //     setSearchQuery(id);
  //   }
  // }, [id]);
  useEffect(() => {
    if (id) setSearchQuery(id);
  }, [id]);

  // Step 2: Trigger search whenever searchQuery OR appliedFilter changes
  useEffect(() => {
    if (searchQuery) {
      searchRestaurant(searchQuery, appliedFilter);
      navigate(`/search/${searchQuery}`);
    }
  }, [searchQuery, appliedFilter]);

  // Step 3: Search handler for button & Enter key
  // const handleSearch = () => {
  //   searchRestaurant(searchQuery, appliedFilter);
  //   navigate(`/search/${searchQuery}`);
  // };

  const handleSearch = () => {
    searchRestaurant(searchQuery, appliedFilter);
    navigate(`/search/${searchQuery}`);
  };

  return (
    <div className="max-w-7xl mx-auto my-10">
      <div className="flex flex-col md:flex-row justify-between gap-10">
        {/* Filter Sidebar */}
        <FilteredPage />

        {/* Search Results */}
        <div className="flex-1">
          {/* Search Input */}
          <div className="relative flex items-center gap-2">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              placeholder="Search by restaurant & cuisines"
              className="shadow-xl indent-7"
            />
            <Search className="absolute left-2 inset-y-1.5 text-gray-500" />

            <Button onClick={handleSearch}>Search</Button>
          </div>

          {/* Filter Badges (optional UI) */}
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:gap-2 my-3">
            <h1 className="font-medium text-lg">
              {searchedRestaurant?.data.length} search result found
            </h1>
            <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
              {appliedFilter.map((selectedItem: string, idx: number) => (
                <div
                  key={idx}
                  className="relative inline-flex items-center max-w-full"
                >
                  <Badge
                    className="text-[#D19254] rounded-md hover:cursor-pointer pr-6 whitespace-nowrap"
                    variant={"outline"}
                  >
                    {selectedItem}
                  </Badge>
                  <X
                    size={16}
                    className="absolute text-[#D19254] right-1 hover:cursor-pointer"
                    onClick={() => {
                      // Remove filter on badge click
                      const { setAppliedFilter } =
                        useRestaurantStore.getState();
                      setAppliedFilter(selectedItem); // toggle off
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Restaurant Cards */}
          <div>
            {searchedRestaurant?.data.length === 0 ? (
              <NoResultFound searchText={searchQuery} />
            ) : (
              <div className="grid md:grid-cols-3 gap-4">
                {searchedRestaurant?.data?.map((restaurant: Restaurant) => (
                  <Card
                    key={restaurant._id}
                    className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 pb-0"
                  >
                    <div className="relative">
                      <AspectRatio ratio={16 / 6}>
                        <img
                          src={restaurant.imageUrl}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </AspectRatio>
                      <div className="absolute top-2 left-2 bg-white dark:bg-gray-700/75 rounded-lg py-1 px-3">
                        <span className="text-sm font-medium text-gray-700 dark-text-gray-300">
                          Featured
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {restaurant.restaurantName}
                      </h1>
                      <div className="mt-2 gap-1 flex items-center text-gray-600 dark:text-gray-400">
                        <MapPin size={16} />
                        <p className="text-sm">
                          City:{" "}
                          <span className="font-medium">{restaurant.city}</span>
                        </p>
                      </div>
                      <div className="mt-2 gap-1 flex items-center text-gray-600 dark:text-gray-400">
                        <Globe size={16} />
                        <p className="text-sm">
                          Country:{" "}
                          <span className="font-medium">
                            {restaurant.country}
                          </span>
                        </p>
                      </div>
                      <div className="flex gap-2 mt-4 flex-wrap">
                        {restaurant.cuisines.map(
                          (cuisine: string, idx: number) => (
                            <Badge
                              key={idx}
                              className="font-medium px-2 py-1 rounded-full shadow-sm"
                            >
                              {cuisine}
                            </Badge>
                          )
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 border-t dark:border-t-gray-700 border-t-gray-100 text-white flex justify-end">
                      <Link to={`/restaurant/${restaurant._id}`}>
                        <Button className="font-semibold rounded-full shadow-md transition-colors duration-200">
                          View Menus
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const NoResultFound = ({ searchText }: { searchText: string }) => {
  return (
    <div className="text-center">
      <h1 className="text-2xl font-semibold text-gray-700 dark:text-gray-500">
        No results found
      </h1>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        We couldn't find any result for "{searchText}". <br /> Try search with a
        different term.
      </p>
      <Link to="/">
        <Button className="mt-4">Go Back to Home</Button>
      </Link>
    </div>
  );
};

export default SearchPage;
