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

interface SearchResult {
  id: string;
  title?: string;
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
      if (query.length > 2) {
        performSearch(query);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL_PROD;

  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    try {
      const response = await axios.get<SearchResult[]>(`${API_URL}/search`, {
        params: { q: searchQuery },
      });
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching search results", error);
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

  const avatarUrl = user?.avatar
    ? user.avatar.startsWith("http")
      ? user.avatar
      : `${API_URL}${user.avatar}`
    : "default-avatar-url";

  return (
    <div id="header" className="bg-customColor-header">
      {/* Desktop Header */}
      <header id="desktop-header" className="p-4 hidden lg:block">
        <div className="container mx-auto flex justify-between items-center">
          <div id="logo" className="text-white text-lg font-semibold">
            <Link href="/">Blogchain</Link>
          </div>
          <div
            id="search-container"
            className="relative text-gray-400 focus-within:text-gray-600"
          >
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 animate-fade-in">
              <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                <path d="M12.9 14.32l4.1 4.1-1.4 1.4-4.1-4.1c-1 .7-2.2 1.1-3.5 1.1C4.9 16.82 2 13.92 2 10.42S4.9 4 8.4 4s6.4 2.9 6.4 6.4c0 1.3-.4 2.5-1.1 3.5zM8.4 14c2 0 3.6-1.6 3.6-3.6S10.4 6.8 8.4 6.8 4.8 8.4 4.8 10.4s1.6 3.6 3.6 3.6z" />
              </svg>
            </span>
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="py-2 pl-10 pr-4 text-sm text-gray-900 bg-white rounded-full shadow transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:scale-105"
              placeholder="Search..."
            />
            {loading && <div id="loading">Loading...</div>}
            {results.length > 0 && (
              <div
                id="results-dropdown"
                className="absolute z-50 mt-2 w-full bg-white shadow-lg rounded-lg"
              >
                {results.map((result) => (
                  <div
                    key={result.id}
                    className="p-2 border-b last:border-0 cursor-pointer hover:bg-gray-200 flex"
                    onClick={() => handleResultClick(result.id)}
                  >
                    <div>
                      <div className="font-semibold">
                        {result.title || result.name}
                      </div>
                      <div
                        className="text-sm text-gray-600 line-clamp-2"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(result.description ?? ""),
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
            className="space-x-4 flex items-center p-4 bg-inherit rounded-full"
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
                    onClick={() => router.push("/users")}
                    className="hover:bg-customColor-innovatio hover:text-white transition-colors duration-300"
                  >
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/newarticles")}
                    className="hover:bg-customColor-innovatio hover:text-white transition-colors duration-300"
                  >
                    Create
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/articles")}
                    className="hover:bg-customColor-innovatio hover:text-white transition-colors duration-300"
                  >
                    Articles
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="hover:bg-customColor-innovatio hover:text-white transition-colors duration-300"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={handleStartNewCampaign}
                className="rounded-full bg-customColor-innovatio text-customColor-innovatio3 hover:bg-customColor-innovatio3 hover:text-customColor-innovatio transition-colors duration-300 shadow-md"
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
          className="fixed top-0 left-0 w-screen z-50 p-4 backdrop-blur-xl bg-customColor-header lg:hidden md:hidden"
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
                    className="w-full rounded-full bg-customColor-innovatio text-customColor-innovatio3 hover:bg-customColor-innovatio3 hover:text-customColor-innovatio"
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
