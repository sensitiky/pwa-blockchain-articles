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

export default function Articles() {
  const categoriesRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);

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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="bg-gradientbg2 w-full">
      <Header />
      <div className="container mx-auto py-8 md:py-12 lg:py-16">
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
                  <DropdownMenuCheckboxItem checked>
                    Saved (Most first)
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>
                    Saved (Less first)
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>
                    Recents (Most first)
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>
                    Recents (Less first)
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>
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
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      className="rounded-full flex-shrink-0 p-2 border"
                    >
                      {category.name}
                    </button>
                  ))}
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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
            <Card className="bg-inherit h-auto rounded-none shadow-none flex flex-col md:flex-row items-start gap-4 border-b-[1px] border-black border-r-0 border-l-0">
              <Image
                src="/Saly-1.png"
                alt="Blog Post Image"
                width={200}
                height={150}
                className="aspect-video w-full md:w-40 mt-10 rounded-lg object-cover"
              />
              <div className="mt-3 flex-1 space-y-2">
                <div className="text-sm font-medium text-muted-foreground">
                  June 15, 2023
                </div>
                <h3 className="text-lg font-semibold">
                  Unlocking the Secrets of Successful Blogging
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div>
                    <UserIcon className="w-4 h-4 mr-1" />
                    John Doe
                  </div>
                  <div>
                    <ClockIcon className="w-4 h-4 mr-1" />5 min read
                  </div>
                </div>
                <p className="text-muted-foreground line-clamp-2">
                  Discover the essential tips and strategies to take your blog
                  to new heights and engage your audience.
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
            <Card className="bg-inherit h-auto rounded-none shadow-none flex flex-col md:flex-row items-start gap-4 border-b-[1px] border-black border-r-0 border-l-0">
              <Image
                src="/Saly-1.png"
                alt="Blog Post Image"
                width={200}
                height={150}
                className="aspect-video w-full md:w-40 mt-10 rounded-lg object-cover"
              />
              <div className="mt-3 flex-1 space-y-2">
                <div className="text-sm font-medium text-muted-foreground">
                  June 10, 2023
                </div>
                <h3 className="text-lg font-semibold">
                  The Art of Crafting Captivating Blog Titles
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div>
                    <UserIcon className="w-4 h-4 mr-1" />
                    Jane Smith
                  </div>
                  <div>
                    <ClockIcon className="w-4 h-4 mr-1" />7 min read
                  </div>
                </div>
                <p className="text-muted-foreground line-clamp-2">
                  Learn the secrets to creating blog titles that grab attention
                  and drive more traffic to your content.
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
            <Card className="bg-inherit h-auto rounded-none shadow-none flex flex-col md:flex-row items-start gap-4 border-b-[1px] border-black border-r-0 border-l-0">
              <Image
                src="/Saly-1.png"
                alt="Blog Post Image"
                width={200}
                height={150}
                className="aspect-video w-full md:w-40 mt-10 rounded-lg object-cover"
              />
              <div className="mt-3 flex-1 space-y-2">
                <div className="text-sm font-medium text-muted-foreground">
                  June 5, 2023
                </div>
                <h3 className="text-lg font-semibold">
                  Mastering the Art of Storytelling in Blogging
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div>
                    <UserIcon className="w-4 h-4 mr-1" />
                    Sarah Lee
                  </div>
                  <div>
                    <ClockIcon className="w-4 h-4 mr-1" />
                    10 min read
                  </div>
                </div>
                <p className="text-muted-foreground line-clamp-2">
                  Discover how to weave captivating stories into your blog posts
                  and connect with your readers on a deeper level.
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
            <Card className="bg-inherit h-auto rounded-none shadow-none flex flex-col md:flex-row items-start gap-4 border-b-[1px] border-black border-r-0 border-l-0">
              <Image
                src="/Saly-1.png"
                alt="Blog Post Image"
                width={200}
                height={150}
                className="aspect-video w-full md:w-40 mt-10 rounded-lg object-cover"
              />
              <div className="mt-3 flex-1 space-y-2">
                <div className="text-sm font-medium text-muted-foreground">
                  June 1, 2023
                </div>
                <h3 className="text-lg font-semibold">
                  Optimizing Your Blog for Maximum Visibility
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div>
                    <UserIcon className="w-4 h-4 mr-1" />
                    Michael Chen
                  </div>
                  <div>
                    <ClockIcon className="w-4 h-4 mr-1" />8 min read
                  </div>
                </div>
                <p className="text-muted-foreground line-clamp-2">
                  Learn the latest SEO strategies to boost your blog's ranking
                  and reach a wider audience.
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
            <Card className="bg-inherit h-auto rounded-none shadow-none flex flex-col md:flex-row items-start gap-4 border-b-[1px] border-black border-r-0 border-l-0">
              <Image
                src="/Saly-1.png"
                alt="Blog Post Image"
                width={200}
                height={150}
                className="aspect-video w-full md:w-40 mt-10 rounded-lg object-cover"
              />
              <div className="mt-3 flex-1 space-y-2">
                <div className="text-sm font-medium text-muted-foreground">
                  May 25, 2023
                </div>
                <h3 className="text-lg font-semibold">
                  Unleashing the Power of Visuals in Blogging
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div>
                    <UserIcon className="w-4 h-4 mr-1" />
                    Emily Gonzalez
                  </div>
                  <div>
                    <ClockIcon className="w-4 h-4 mr-1" />6 min read
                  </div>
                </div>
                <p className="text-muted-foreground line-clamp-2">
                  Discover how to use stunning visuals to enhance your blog
                  posts and captivate your audience.
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
          </div>
          <div className="mt-8 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
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
