"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import LoginCard from "@/assets/login";
import axios from "axios";
import { useAuth } from "../../context/authContext";

const Header = () => {
  const router = useRouter();
  const [showLoginCard, setShowLoginCard] = useState(false);
  const { user, setUser, isAuthenticated, login, logout } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get(
            "https://blogchain.onrender.com/users/me",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setUser(response.data);
        } catch (error) {
          console.error("Error fetching user data", error);
        }
      }
    };
    fetchUser();
  }, [setUser]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/newarticles");
    }
  }, [isAuthenticated, router]);

  const handleStartNewCampaign = () => {
    if (!isAuthenticated) {
      setShowLoginCard(true);
    } else {
      router.push("/newarticles");
    }
  };

  const handleCloseModal = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowLoginCard(false);
    }
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
                  href="#"
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
              href="/about"
              className="text-white hover:text-customColor-hueso"
            >
              About Us
            </Link>
            <Link
              href="/users"
              className="text-white hover:text-customColor-hueso"
            >
              Users
            </Link>
            <Link
              href="/newarticles"
              className="text-white hover:text-customColor-hueso"
            >
              Create Articles
            </Link>
            <Link
              href="/articles"
              className="text-white hover:text-customColor-hueso"
            >
              Articles
            </Link>
            {isAuthenticated ? (
              <Avatar className="rounded-full">
                <AvatarImage src={user?.profilePicture} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
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
            <LoginCard
              onClose={function (): void {
                throw new Error("Function not implemented.");
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default Header;
