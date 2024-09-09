"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import LoginCard from "@/assets/login";
import { useAuth } from "../../context/authContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import DOMPurify from "dompurify";
import { CircularProgress } from "@mui/material";
import Image from "next/image";
import Search from "@/utils/svg";

interface ImageBuffer {
  type: string;
  data: Uint8Array;
}

interface SearchResult {
  id: string;
  title?: string;
  imageUrl: { type: string; data: number[] } | null;
  imageUrlBase64: string;
  name?: string;
  description?: string;
}

const Header = () => {
  const router = useRouter();
  const [showLoginCard, setShowLoginCard] = useState(false);
  const { user, setUser, isAuthenticated, login, logout } = useAuth();
  const prevIsAuthenticated = useRef(isAuthenticated);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);
  const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim().length > 2) {
        performSearch(query.trim());
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL_DEV;

  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    try {
      const fullUrl = `${API_URL}/search?q=${encodeURIComponent(searchQuery)}`;

      const response = await axios.get<SearchResult[]>(fullUrl, {
        headers: { "Cache-Control": "no-cache" },
      });

      if (Array.isArray(response.data)) {
        const resultsWithBase64Images = response.data.map((result) => {
          if (result.imageUrl && result.imageUrl.type === "Buffer") {
            // Convertir el buffer a una cadena Base64
            const base64String = Buffer.from(result.imageUrl.data).toString(
              "base64"
            );
            result.imageUrlBase64 = `data:image/jpeg;base64,${base64String}`;
          }
          return result;
        });

        setResults(resultsWithBase64Images);
        console.log(resultsWithBase64Images);
      } else {
        console.error("Unexpected response format:", response.data);
        setResults([]);
      }
    } catch (error: any) {
      console.error("Error fetching search results:", error.response || error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (id: string) => {
    router.push(`/posts/${id}`);
    setResults([]);
    setQuery("");
  };

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      let previous = scrollYProgress.getPrevious();
      if (previous !== undefined) {
        let direction = current - previous;
        if (scrollYProgress.get() < 0.05) {
          setVisible(true);
        } else {
          if (direction < 0) {
            setVisible(true);
          } else {
            setVisible(false);
          }
        }
      }
    }
  });

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem("lastVisitedUrl", window.location.pathname);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    if (isAuthenticated) {
      const lastVisitedUrl = localStorage.getItem("lastVisitedUrl");
      if (lastVisitedUrl) {
        router.push(lastVisitedUrl);
        localStorage.removeItem("lastVisitedUrl");
      }
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
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

  const avatarUrl = user?.avatar
    ? user.avatar.startsWith("http")
      ? user.avatar
      : `${API_URL}${user.avatar}`
    : "/default-avatar.webp";

  return (
    <div id="header" className="bg-[#000916] font-normal">
      {/* Desktop Header */}
      <header id="desktop-header" className="p-4 hidden lg:block">
        <div className="container mx-auto flex justify-between items-center">
          <div id="logo" className="text-white text-lg font-bold">
            <Link href="/">Blogchain</Link>
          </div>
          <div
            id="search-container"
            className="relative text-gray-400 focus-within:text-gray-600"
          >
            <Search />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="py-2 pl-10 pr-4 w-[25rem] text-sm text-gray-900 bg-[#01132D] rounded-full shadow transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:scale-105"
              placeholder="Search"
            />
            {loading && (
              <div
                className="bg-white rounded-lg shadow-lg mt-2 p-2 absolute z-50 w-full justify-center flex"
                id="loading"
              >
                <CircularProgress />
              </div>
            )}
            {results.length > 0 && (
              <div
                id="results-dropdown"
                className="absolute z-50 mt-2 w-full bg-white shadow-lg rounded-lg"
              >
                {results.map((result) => (
                  <div
                    key={result.id}
                    className="p-2 border-b last:border-0 cursor-pointer hover:bg-gray-200 flex h-full"
                    onClick={() => handleResultClick(result.id)}
                  >
                    <div>
                      <div className="font-semibold">
                        {result.title || result.name}
                      </div>
                      {result.imageUrlBase64 ? (
                        <div className="w-full h-fit">
                          <Image
                            src={result.imageUrlBase64}
                            alt="Post Image"
                            width={1920}
                            height={1080}
                            layout="responsive"
                            objectFit="contain"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-48 bg-gray-200 rounded-lg"></div>
                      )}
                      <div
                        className="text-sm text-gray-600 line-clamp-2"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(result.description ?? "", {
                            ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p"],
                            ALLOWED_ATTR: ["href"],
                          }),
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <style jsx>{`
            @keyframes fade-in {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }

            .animate-fade-in {
              animation: fade-in 0.5s ease-in-out;
            }

            #results-dropdown {
              max-height: 300px;
              overflow-y: auto;
            }

            #results-dropdown .mini-preview {
              display: flex;
              align-items: center;
            }

            #results-dropdown .mini-preview img {
              width: 50px;
              height: 50px;
              object-fit: cover;
              border-radius: 8px;
              margin-right: 10px;
            }

            #results-dropdown .mini-preview .preview-text {
              flex: 1;
            }

            #results-dropdown .mini-preview .preview-text .title {
              font-weight: bold;
            }

            #results-dropdown .mini-preview .preview-text .description {
              color: gray;
              font-size: 0.875rem;
            }
          `}</style>
          <nav
            id="nav"
            className="space-x-4 flex items-center p-4 bg-inherit rounded-full font-normal"
          >
            <Link
              href="/"
              className="text-customColor-hueso hover:text-customColor-innovatio transition-colors duration-300"
            >
              Home
            </Link>
            <Link
              href="/articles"
              className="text-customColor-hueso hover:text-customColor-innovatio transition-colors duration-300"
            >
              Articles
            </Link>
            <Link
              href="/about"
              className="text-customColor-hueso hover:text-customColor-innovatio transition-colors duration-300"
            >
              About Us
            </Link>
            <Link
              href="/support"
              className="text-customColor-hueso hover:text-customColor-innovatio transition-colors duration-300"
            >
              Support Us
            </Link>
            {isAuthenticated ? (
              <DropdownMenu>
                <p className="text-[#FFC017] font-normal text-xl">
                  Hi, {user?.user}!
                </p>
                <DropdownMenuTrigger asChild>
                  <Avatar className="rounded-full cursor-pointer shadow-md transition-transform duration-300 hover:scale-105">
                    <AvatarImage
                      src={avatarUrl}
                      alt={`${user?.firstName}'s avatar`}
                    />
                    <AvatarFallback>{user?.user}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white shadow-lg rounded-lg">
                  <DropdownMenuLabel className="text-customColor-innovatio3">
                    My Account
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => router.push("/users?section=personal")}
                    className="hover:bg-gray-100 hover:text-white transition-colors duration-300 font-normal"
                  >
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/users?section=articles")}
                    className="hover:bg-gray-100 hover:text-white transition-colors duration-300 font-normal"
                  >
                    My Articles
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/users?section=saved")}
                    className="hover:bg-gray-100 hover:text-white transition-colors duration-300 font-normal"
                  >
                    Saved Items
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/users?section=security")}
                    className="hover:bg-gray-100 hover:text-white transition-colors duration-300 font-normal"
                  >
                    Security & Socials
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="hover:bg-gray-100 hover:text-white transition-colors duration-300 font-bold"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
                <Link href={"/newarticles"}>
                  <Button className="bg-white text-[#000916] font-normal rounded-full hover:bg-white/80">
                    Write a Blog
                  </Button>
                </Link>
              </DropdownMenu>
            ) : (
              <Button
                onClick={handleStartNewCampaign}
                className="font-normal rounded-full bg-gray-100 text-[#000916] hover:bg-[#000916] hover:border hover:border-gray-100 hover:text-gray-100 transition-colors duration-300 shadow-md"
              >
                Get Started
              </Button>
            )}
          </nav>
        </div>
      </header>

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.3 }}
          className=" top-0 left-0 w-screen z-50 p-4 backdrop-blur-xl bg-[#000916] lg:hidden md:block"
        >
          <div className="container mx-auto flex justify-between items-center">
            <div id="mobile-logo" className="text-lg text-white font-semibold">
              <Link href="/">Blogchain</Link>
            </div>
            <button
              className="text-white focus:outline-none"
              onClick={() => setIsMobileMenuVisible(!isMobileMenuVisible)}
            >
              {isMobileMenuVisible ? "✕" : "☰"}
            </button>
          </div>
          <AnimatePresence>
            {isMobileMenuVisible && (
              <motion.nav
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="mt-4 space-y-2"
              >
                <Link
                  href="/"
                  className="block text-gray-300 hover:text-gray-700"
                >
                  Home
                </Link>
                <Link
                  href="/articles"
                  className="block text-gray-300 hover:text-gray-700"
                >
                  Articles
                </Link>
                <Link
                  href="/about"
                  className="block text-gray-300 hover:text-gray-700"
                >
                  About Us
                </Link>
                <Link
                  href="/support"
                  className="block text-gray-300 hover:text-gray-700"
                >
                  Support Us
                </Link>
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/users"
                      className="block text-gray-300 hover:text-gray-700"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/newarticles"
                      className="block text-gray-300 hover:text-gray-700"
                    >
                      Create
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block text-gray-300 hover:text-gray-700"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleStartNewCampaign}
                    className="w-full rounded-full bg-customColor-innovatio text-customColor-innovatio3 hover:bg-gray-1003 hover:text-customColor-innovatio"
                  >
                    Get Started
                  </button>
                )}
              </motion.nav>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {showLoginCard && (
        <div
          id="login-modal"
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
