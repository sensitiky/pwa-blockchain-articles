import React, { useState } from "react";
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

const SavedItems: React.FC = () => {
  const [liked, setLiked] = useState<boolean[]>(Array(3).fill(false));

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
              <Button variant="outline" size="sm" className="gap-2 rounded-none bg-inherit border-r-0 border-l-0 border-border border-black">
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
        <div className="mt-4 ">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="border-t-[1px] border-b-[1px] border-r-0 border-l-0 flex flex-col md:flex-row items-center justify-between p-4 sm:p-6 bg-inherit shadow-none rounded-none"
            >
              <img
                src="/test.jpg"
                alt="Placeholder"
                className="m-5 h-40 w-full md:w-auto md:h-44 rounded-lg border border-gray-300 mr-4"
              />
              <div className="flex items-center mb-4 md:mb-0">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Why Blockchain is Hard
                  </h3>
                  <div className="text-muted-foreground">
                    <UserIcon className="w-4 h-4 mr-1" />
                    Michael Chen
                  </div>
                  <p className="text-gray-600">
                    The hype around blockchain is massive. To hear the
                    blockchain hype train tell it, blockchain will now: Solve
                    income inequality. Make all data secure forever. Make
                    everything much more efficient and trustless. Save dying.
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => toggleLike(index)}
                  className="ml-2 p-2 focus:outline-none"
                >
                  <BookMarkedIcon
                    className={`h-5 w-5 ${
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
