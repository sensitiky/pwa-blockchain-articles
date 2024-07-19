"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import { JSX, SVGProps } from "react";
import Header from "@/assets/header";
import Image from "next/image";
import Footer from "@/assets/footer";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import axios from "axios";

type Category = {
  id: number;
  name: string;
};

type Post = {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  description: string;
  author: { usuario: string };
};

const POSTS_PER_PAGE = 5;

export default function Articles() {
  const categoriesRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [orderBy, setOrderBy] = useState<string>("recentDesc");

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "https://blogchain.onrender.com/categories"
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  const fetchPosts = async (page: number, order: string) => {
    try {
      const response = await axios.get(
        `https://blogchain.onrender.com/posts?page=${page}&order=${order}&limit=${POSTS_PER_PAGE}`
      );
      console.log("Fetched posts:", response.data);
      setPosts(response.data.posts || []); // Add a fallback to an empty array
      setTotalPages(response.data.totalPages || 1); // Add a fallback to 1
    } catch (error) {
      console.error("Error fetching posts", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchPosts(currentPage, orderBy);
  }, [currentPage, orderBy]);

  const handleOrderChange = (order: string) => {
    setOrderBy(order);
    setCurrentPage(1);
  };

  const scrollLeft = () => {
    if (categoriesRef.current) {
      categoriesRef.current.scrollBy({
        left: -200,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (categoriesRef.current) {
      categoriesRef.current.scrollBy({
        left: 200,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="bg-gradientbg2 w-full flex flex-col min-h-screen">
      <Header />
      <div className="container mx-auto py-8 md:py-12 lg:py-16 flex-grow">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
          <div className="space-y-4 md:space-y-6">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-center text-yellow-400">
              Articles
            </h1>
            <p className="text-muted-foreground md:text-xl lg:text-lg text-center text-customColor-welcome">
              Choose your favourite categories
            </p>
            <div className="flex justify-center mt-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-t-[1px] border-b-[1px] border-r-0 border-l-0 border-black bg-inherit rounded-none hover:bg-inherit"
                  >
                    <ArrowUpDownIcon className="h-4 w-4" />
                    Order
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Order by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={orderBy === "savedDesc"}
                    onClick={() => handleOrderChange("savedDesc")}
                  >
                    Saved (Most first)
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={orderBy === "savedAsc"}
                    onClick={() => handleOrderChange("savedAsc")}
                  >
                    Saved (Less first)
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={orderBy === "recentDesc"}
                    onClick={() => handleOrderChange("recentDesc")}
                  >
                    Recents (Most first)
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={orderBy === "recentAsc"}
                    onClick={() => handleOrderChange("recentAsc")}
                  >
                    Recents (Less first)
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={orderBy === "relevant"}
                    onClick={() => handleOrderChange("relevant")}
                  >
                    More Relevants
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 md:justify-center">
            <div className="space-y-2">
              <h3 className="text-center text-lg font-medium text-black">
                Categories
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={scrollLeft}
                  className="rounded-full bg-inherit hover:bg-inherit border-none p-2"
                >
                  <ChevronLeftIcon className="h-6 w-6" />
                </button>
                <div
                  ref={categoriesRef}
                  className="flex overflow-hidden gap-4"
                  style={{ width: "600px" }}
                >
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <button
                        key={category.id}
                        className="rounded-full flex-shrink-0 p-2 border"
                      >
                        {category.name}
                      </button>
                    ))
                  ) : (
                    <div className="text-muted-foreground">
                      No categories available
                    </div>
                  )}
                </div>
                <button
                  onClick={scrollRight}
                  className="rounded-full bg-inherit hover:bg-inherit border-none p-2"
                >
                  <ChevronRightIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 md:mt-16 lg:mt-20">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Card
                  key={post.id}
                  className="bg-inherit h-auto rounded-none shadow-none flex flex-col items-start gap-4 border-b-[1px] border-black border-r-0 border-l-0"
                >
                  {post.imageUrl && (
                    <Image
                      src={post.imageUrl}
                      alt="Blog Post Image"
                      width={200}
                      height={150}
                      className="aspect-video w-full mt-10 rounded-lg object-cover"
                    />
                  )}
                  <div className="mt-3 flex-1 space-y-2 px-4">
                    <div className="text-sm font-medium text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                    <h3 className="text-lg font-semibold">{post.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div>
                        <UserIcon className="w-4 h-4 mr-1" />
                        {post.author.usuario}
                      </div>
                      <div>
                        <ClockIcon className="w-4 h-4 mr-1" />5 min read
                      </div>
                    </div>
                    <p className="text-muted-foreground line-clamp-2">
                      {post.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <Button variant="ghost" size="icon">
                        <HeartIcon className="w-4 h-4" />
                        <span className="sr-only">Like</span>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MessageCircleIcon className="w-4 h-4" />
                        <span className="sr-only">Comment</span>
                      </Button>
                      <Link
                        href="#"
                        className="text-primary hover:underline"
                        prefetch={false}
                      >
                        Read more
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              No posts available
            </div>
          )}
          <div className="mt-8 flex justify-center mb-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    href="#"
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      href="#"
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    href="#"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function ClockIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function HeartIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function MessageCircleIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}

function UserIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function XIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function ArrowUpDownIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21 16-4 4-4-4" />
      <path d="M17 20V4" />
      <path d="m3 8 4-4 4 4" />
      <path d="M7 4v16" />
    </svg>
  );
}
