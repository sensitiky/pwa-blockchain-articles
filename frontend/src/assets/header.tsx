"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import LoginCard from "@/assets/login";
import api from "../../services/api";
import { useAuth } from "../../context/authContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import axios from "axios";

const Header = () => {
  const router = useRouter();
  const [showLoginCard, setShowLoginCard] = useState(false);
  const { user, setUser, isAuthenticated, login, logout } = useAuth();
  const prevIsAuthenticated = useRef(isAuthenticated);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("Attempting to fetch user data");
        const response = await api.get("https://blogchain.onrender.com/users/me");
        console.log("User data fetched successfully", response.data);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data", error);

        if (axios.isAxiosError(error)) {
          console.log("Error response data", error.response?.data);
          console.log("Error response status", error.response?.status);
          console.log("Error response headers", error.response?.headers);
        } else {
          console.log("Unexpected error", error);
        }
      }
    };

    if (isAuthenticated) {
      fetchUser();
    }
  }, [isAuthenticated, setUser]);

  useEffect(() => {
    if (!prevIsAuthenticated.current && isAuthenticated) {
      router.push("/");
    }
    prevIsAuthenticated.current = isAuthenticated;
  }, [isAuthenticated, router]);

  const handleStartNewCampaign = () => {
    if (!isAuthenticated) {
      setShowLoginCard(true);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleCloseModalOnClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowLoginCard(false);
    }
  };

  const handleCloseModalOnKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setShowLoginCard(false);
    }
  };

  return (
    <div className="bg-customColor-header">
      <div className="lg:hidden flex items-center justify-between px-4 lg:px-6 h-14 border-b">
        <div className="text-white text-lg font-semibold">
          <Link href="/">Blogchain</Link>
        </div>
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger>
              <button className="focus:outline-none">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="white"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  ></path>
                </svg>
              </button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Blogchain</SheetTitle>
                <SheetDescription>Welcome to Blogchain</SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col gap-8 py-9">
                <Link
                  href="/"
                  className="w-fit border-b-[1px] border-gray-400 text-sm font-medium hover:underline underline-offset-4"
                  prefetch={false}
                >
                  Home
                </Link>
                <Link
                  href="/users"
                  className="w-fit border-b-[1px] border-gray-400 text-sm font-medium hover:underline underline-offset-4"
                  prefetch={false}
                >
                  Users
                </Link>
                <Link
                  href="/articles"
                  className="w-fit border-b-[1px] border-gray-400 text-sm font-medium hover:underline underline-offset-4"
                  prefetch={false}
                >
                  Articles
                </Link>
                <Link
                  href="/about"
                  className="w-fit border-b-[1px] border-gray-400 text-sm font-medium hover:underline underline-offset-4"
                  prefetch={false}
                >
                  About Us
                </Link>
                <Link
                  href="/newarticles"
                  className="w-fit border-b-[1px] border-gray-400 text-sm font-medium hover:underline underline-offset-4"
                  prefetch={false}
                >
                  Create Articles
                </Link>
                <Link
                  href="/support"
                  className="w-fit border-b-[1px] border-gray-400 text-sm font-medium hover:underline underline-offset-4"
                  prefetch={false}
                >
                  Help with the Campaign
                </Link>
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    className="bg-customColor-innovatio2 rounded-full px-4 py-2 text-sm font-medium hover:bg-customColor-innovatio3"
                    onClick={() => setShowLoginCard(true)}
                  >
                    Get Started
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <header className="p-4 hidden lg:block">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white text-lg font-semibold">
            <Link href="/">Blogchain</Link>
          </div>
          <div className="relative text-gray-400 focus-within:text-gray-600">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
              <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                <path d="M12.9 14.32l4.1 4.1-1.4 1.4-4.1-4.1c-1 .7-2.2 1.1-3.5 1.1C4.9 16.82 2 13.92 2 10.42S4.9 4 8.4 4s6.4 2.9 6.4 6.4c0 1.3-.4 2.5-1.1 3.5zM8.4 14c2 0 3.6-1.6 3.6-3.6S10.4 6.8 8.4 6.8 4.8 8.4 4.8 10.4s1.6 3.6 3.6 3.6z" />
              </svg>
            </span>
            <Input
              type="search"
              className="py-2 text-sm text-customColor-innovatio3 bg-dark-blue rounded-full pl-10 focus:outline-none focus:bg-white focus:text-gray-900"
              placeholder="Search..."
            />
          </div>
          <nav className="space-x-4 flex items-center">
            <Link href="/" className="text-white hover:text-customColor-hueso">
              Home
            </Link>
            <Link
              href="/articles"
              className="text-white hover:text-customColor-hueso"
            >
              Articles
            </Link>
            <Link
              href="/about"
              className="text-white hover:text-customColor-hueso"
            >
              About Us
            </Link>
            <Link
              href="/support"
              className="text-white hover:text-customColor-hueso"
            >
              Support Us
            </Link>
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="rounded-full cursor-pointer">
                    <AvatarImage
                      src={
                        user.avatar?.startsWith("http")
                          ? user.avatar
                          : `https://blogchain.onrender.com${user.avatar}`
                      }
                    />
                    <AvatarFallback>{user.usuario}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/users")}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/newarticles")}>
                    Create
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/articles")}>
                    Articles
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={handleStartNewCampaign}
                className="rounded-full bg-customColor-innovatio text-customColor-innovatio3 hover:bg-customColor-innovatio3 hover:text-customColor-innovatio"
              >
                Get Started
              </Button>
            )}
          </nav>
        </div>
      </header>

      {showLoginCard && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={handleCloseModalOnClick}
          onKeyDown={handleCloseModalOnKeyDown}
          role="button"
          tabIndex={0}
        >
          <div className="relative bg-white p-8 rounded-lg shadow-lg">
            <LoginCard onClose={() => setShowLoginCard(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
