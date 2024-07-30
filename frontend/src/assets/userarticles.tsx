import React, { useState, useEffect } from "react";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsUpDown, faFilter } from "@fortawesome/free-solid-svg-icons";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import Link from "next/link";

const POSTS_PER_PAGE = 5; // Updated to 5

type Category = {
  id: number;
  name: string;
};

type Post = {
  id: number;
  title: string;
  content: string | null;
  description: string | null;
  createdAt: Date;
  imageUrl: string | null;
  author: { id: number; user: string; avatar: string | null };
  category: Category | null;
  comments: any[];
  favorites: number;
};

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [order, setOrder] = useState<string>("Date (newest first)");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUserPosts(page);
  }, [order, page]);

  const fetchUserPosts = async (page: number) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/users/me/posts?page=${page}&limit=${POSTS_PER_PAGE}&order=${order}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("API Response:", response.data);

      const postsData = response.data.posts.map((post: any) => ({
        ...post,
        createdAt: new Date(post.createdAt),
        comments: post.comments || [],
        favorites: post.favorites || 0,
      }));

      console.log("Deserialized Posts:", postsData);

      setPosts(postsData || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching user posts", error);
    }
  };

  const handleOrderChange = (newOrder: string) => {
    console.log("Order changed to:", newOrder);
    setOrder(newOrder);
    setPage(1);
  };

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <h1 className="text-2xl font-bold">Your posts</h1>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-inherit border-r-0 border-l-0 border-border border-black rounded-none"
              >
                <FontAwesomeIcon icon={faArrowsUpDown} className="h-4 w-4" />
                Order
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Order by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={order === "Date (newest first)"}
                onCheckedChange={() => handleOrderChange("Date (newest first)")}
              >
                Date (newest first)
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={order === "Date (oldest first)"}
                onCheckedChange={() => handleOrderChange("Date (oldest first)")}
              >
                Date (oldest first)
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={order === "Title"}
                onCheckedChange={() => handleOrderChange("Title")}
              >
                Title
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
        {posts.length === 0 ? (
          <p className="text-center col-span-3 text-gray-500">
            No posts available
          </p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="relative group overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
            >
              <img
                src={`http://localhost:4000${post.imageUrl}`}
                alt={post.title}
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-white p-4">
                <Badge className="mb-2 bg-green-500 text-white">
                  Published
                </Badge>
                <Link href={`/posts/${post.id}`}>
                  <Button
                    variant="outline"
                    className="text-white border-none hover:underline bg-transparent hover:bg-transparent hover:text-white"
                  >
                    Read More
                  </Button>
                </Link>
              </div>
              <h3 className="absolute top-0 left-0 right-0 text-lg mb-2 text-center text-black font-semibold backdrop-blur-lg bg-opacity-20 bg-black p-2 z-10">
                {post.title}
              </h3>
            </div>
          ))
        )}
      </div>
      <div className="pagination-container flex justify-center mt-8">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                href="#"
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, index) => (
              <PaginationItem key={index}>
                <PaginationLink href="#" onClick={() => setPage(index + 1)}>
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                href="#"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default Posts;
