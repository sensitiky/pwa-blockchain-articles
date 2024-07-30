import React, { useState, useEffect } from "react";
import { BookMarkedIcon, UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsUpDown } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import DOMPurify from "dompurify";

const SavedItems: React.FC<{ userId: number }> = ({ userId }) => {
  const [favorites, setFavorites] = useState<
    { imageUrl: string; title: string; author: string; description: string }[]
  >([]);
  const [liked, setLiked] = useState<boolean[]>([]);

  useEffect(() => {
    axios.get(`http://localhost:4000/users/${userId}/favorites`).then((res) => {
      setFavorites(res.data);
      setLiked(res.data.map(() => false));
    });
  }, [userId]);

  const toggleLike = (index: number) => {
    const newLiked = [...liked];
    newLiked[index] = !newLiked[index];
    setLiked(newLiked);
  };

  return (
    <section className="max-h-dvh w-full py-6 md:py-12 lg:py-16">
      <div className="container px-4 md:px-6">
        <h2 className="text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-800 mb-4">
          Your favorite items
        </h2>
        <div className="flex items-center justify-end gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 rounded-lg bg-inherit border-r-0 border-l-0 border-border border-black shadow-md"
              >
                <FontAwesomeIcon icon={faArrowsUpDown} className="h-4 w-4" />
                Order
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Order by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>
                Date (newest first)
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>
                Date (oldest first)
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Title</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mt-4">
          {Array.isArray(favorites) &&
            favorites.map((favorite, index) => (
              <div
                key={index}
                className="card border-t-[1px] border-b-[1px] border-r-0 border-l-0 flex flex-col md:flex-row items-center justify-between p-4 sm:p-6 bg-inherit shadow-md rounded-lg mb-4"
              >
                <img
                  src={favorite.imageUrl || "/test.jpg"}
                  alt={favorite.title || "Placeholder"}
                  className="m-5 h-40 w-full md:w-auto md:h-44 rounded-lg border border-gray-300 mr-4"
                />
                <div className="flex flex-col items-start mb-4 md:mb-0">
                  <h3 className="text-lg font-bold text-gray-900">
                    {favorite.title || "Untitled"}
                  </h3>
                  <div className="text-muted-foreground flex items-center">
                    <UserIcon className="w-4 h-4 mr-1" />
                    {favorite.author || "Unknown Author"}
                  </div>
                  <p className="text-gray-600">
                    {favorite.description ? (
                      <span
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(favorite.description),
                        }}
                      />
                    ) : (
                      "No description available."
                    )}
                  </p>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => toggleLike(index)}
                    className="ml-2 p-2 focus:outline-none transition-transform transform hover:scale-110 active:scale-95"
                    aria-label={liked[index] ? "Unsave item" : "Save item"}
                  >
                    <BookMarkedIcon
                      className={`h-5 w-5 transition-colors duration-300 ${
                        liked[index] ? "text-yellow-500" : "text-gray-500"
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default SavedItems;
