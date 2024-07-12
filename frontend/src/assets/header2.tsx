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

const Header2 = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({ name: "", profilePicture: "" });

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      setIsAuthenticated(true);
      setUser({
        name: "John Doe",
        profilePicture: "/Saly-1.png",
      });
    }
  }, []);

  const handleStartNewCampaign = () => {
    if (!isAuthenticated) {
      router.push("/authentication");
    } else {
      router.push("/newarticles");
    }
  };

  return (
    <div>
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between px-4 lg:px-6 h-14 border-b bg-customColor-header w-full">
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
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Blogchain</SheetTitle>
                <SheetDescription>Welcome to Blogchain!</SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col gap-8">
                <Link
                  href="#"
                  className="text-sm font-medium hover:text-customColor-hueso4"
                  prefetch={false}
                >
                  How it works
                </Link>
                <Link
                  href="#"
                  className="text-sm font-medium hover:text-customColor-hueso4"
                  prefetch={false}
                >
                  About us
                </Link>
                <Link
                  href="#"
                  className="text-sm font-medium hover:text-customColor-hueso4"
                  prefetch={false}
                >
                  Help with the Campaign
                </Link>
                <div className="flex justify-center">
                  <Link href="/authentication">
                    <Button
                      variant="outline"
                      className="bg-customColor-innovatio2 rounded-full px-4 py-2 text-sm font-medium hover:text-customColor-hueso"
                    >
                      Get Started
                    </Button>
                  </Link>
                </div>
                <div className="flex justify-center">
                  <Button className="bg-customColor-innovatio3 rounded-full px-4 py-2 text-sm font-medium">
                    Connect Wallet
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
        <div>
          <Link href="/">
            <img src="/Logo.svg" alt="Logo" className="h-8 filter invert" />
          </Link>
        </div>
      </div>

      {/* Desktop Header */}
      <header className="p-4 hidden lg:block bg-customColor-header">
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
            <Link
              href="/about-us"
              className="text-white hover:text-customColor-hueso"
            >
              About Us
            </Link>
            <Link
              href="/support-us"
              className="text-white hover:text-customColor-hueso"
            >
              Support Us
            </Link>
            <Link
              href="/articles"
              className="text-white hover:text-customColor-hueso"
            >
              Articles
            </Link>
            <Link
              href="/tops"
              className="text-white hover:text-customColor-hueso"
            >
              Tops
            </Link>
            {isAuthenticated ? (
              <Avatar className="rounded-full">
                <AvatarImage src={user.profilePicture} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            ) : (
              <Button
                className="rounded-full bg-customColor-innovatio text-customColor-innovatio3 hover:text-customColor-hueso"
                onClick={handleStartNewCampaign}
              >
                Get Started
              </Button>
            )}
          </nav>
        </div>
      </header>
    </div>
  );
};

export default Header2;
