import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsUpDown, faFilter } from "@fortawesome/free-solid-svg-icons";

const articles = [
  {
    id: 1,
    title: "Titulo de ejemplo",
    date: "June 02, 2022",
    status: "Published",
    imageUrl: "/test.jpg",
  },
  {
    id: 3,
    title: "Titulo de ejemplo",
    date: "June 02, 2022",
    status: "Draft",
    imageUrl: "/test.jpg",
  },
  {
    id: 4,
    title: "Titulo de ejemplo",
    date: "June 02, 2022",
    status: "Published",
    imageUrl: "/test.jpg",
  },
  {
    id: 5,
    title: "Titulo de ejemplo",
    date: "June 02, 2022",
    status: "Draft",
    imageUrl: "/test.jpg",
  },
  // Agrega más artículos según sea necesario
];

const Articles: React.FC = () => {
  return (
    <>
      <div className="flex items-center justify-between py-4">
        <h1 className="text-2xl font-bold">Your articles</h1>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <FontAwesomeIcon icon={faFilter} className="h-4 w-4" />
                State
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by state</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>
                Published
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <div
            key={article.id}
            className="relative group overflow-hidden rounded-lg shadow-lg"
          >
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-white p-4">
              <Badge
                className={`mb-2 ${
                  article.status === "Published"
                    ? "bg-green-500 text-white"
                    : "bg-yellow-500 text-white"
                }`}
              >
                {article.status}
              </Badge>
              <Button
                variant="outline"
                className="text-white border-none hover:underline bg-transparent hover:bg-transparent hover:text-white"
              >
                Read More
              </Button>
            </div>
            <h3 className="absolute top-0 left-0 right-0 text-lg font-normal mb-2 text-center text-black backdrop-blur-sm bg-opacity-20 bg-black p-2 z-10">
              {article.title}
            </h3>
          </div>
        ))}
      </div>
    </>
  );
};

export default Articles;
