"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { FaComment, FaHeart } from "react-icons/fa";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Header from "@/assets/header";
import Footer from "@/assets/footer";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

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
  author?: { id: number; usuario: string };
  category?: Category;
};

const POSTS_PER_PAGE = 5;

export default function Articles() {
  const categoriesRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [sortOrder, setSortOrder] = useState<string>("recent");

  const fetchCategories = async () => {
    try {
      const response = await axios.get("https://blogchain.onrender.com/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  const fetchPosts = async (page: number, categoryId?: number) => {
    try {
      const url = categoryId
        ? `https://blogchain.onrender.com/posts/by-category?page=${page}&limit=${POSTS_PER_PAGE}&categoryId=${categoryId}&sortOrder=${sortOrder}`
        : `https://blogchain.onrender.com/posts?page=${page}&limit=${POSTS_PER_PAGE}&sortOrder=${sortOrder}`;
      const response = await axios.get(url);
      const postsData = response.data.data;
      setPosts(postsData || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching posts", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchPosts(currentPage, selectedCategoryId || undefined);
  }, [currentPage, selectedCategoryId, sortOrder]);

  const handleCategoryClick = (categoryId: number) => {
    const newCategoryId = selectedCategoryId === categoryId ? null : categoryId;
    setSelectedCategoryId(newCategoryId);
    setCurrentPage(1);
    fetchPosts(1, newCategoryId || undefined);
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

  const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
    fetchPosts(1, selectedCategoryId || undefined);
  };

  return (
    <div className="bg-gradient2 articles-container flex flex-col min-h-screen">
      <Header />
      <div className="articles-header w-full bg-customColor-header text-center py-8 px-4">
        <div className="articles-title-container py-4">
          <h1 className="articles-title text-4xl font-bold text-yellow-500">
            Articles
          </h1>
        </div>
        <div className="categories-container text-center py-4 w-full">
          <h3 className="categories-title text-xl font-medium text-white">
            Categories
          </h3>
          <div className="categories-scroll flex items-center justify-center mt-4 space-x-4">
            <button className="block lg:hidden" onClick={scrollLeft}>
              <ChevronLeftIcon className="h-6 w-6 text-white" />
            </button>
            <div
              ref={categoriesRef}
              className="categories-list flex overflow-x-auto space-x-4 w-full justify-center"
            >
              {categories.length > 0 ? (
                categories.map((category) => (
                  <button
                    key={category.id}
                    className={`category-item w-auto px-4 py-2 border border-white rounded-full text-white bg-inherit whitespace-nowrap ${
                      selectedCategoryId === category.id
                        ? "bg-yellow-500 text-black"
                        : ""
                    }`}
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    {category.name}
                  </button>
                ))
              ) : (
                <div className="text-white">No categories available</div>
              )}
            </div>
            <button className="block lg:hidden" onClick={scrollRight}>
              <ChevronRightIcon className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>
        <div className="sort-order-container text-center justify-center py-4">
          <label htmlFor="sortOrder" className="text-white">
            Sort by:
          </label>
          <select
            id="sortOrder"
            className="ml-2 p-2 rounded"
            value={sortOrder}
            onChange={handleSortOrderChange}
          >
            <option value="recent">Most Recents</option>
            <option value="saved">Most Saved</option>
            <option value="comment">More Comments</option>
          </select>
        </div>
      </div>

      <div className="articles-content flex-grow flex justify-center py-8 px-4 bg-white">
        <div className="posts-container w-full max-w-screen-lg mx-auto">
          {posts.length > 0 ? (
            <div className="posts-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1">
              {posts.map((post) => (
                <CardContainer
                  key={post.id}
                  className="inter-var mx-auto w-[896px] h-[290px]"
                >
                  <CardBody className="bg-card text-card-foreground border border-border rounded-lg shadow-md w-full h-full transition-transform relative">
                    <div className="flex flex-col md:flex-row h-full">
                      {post.imageUrl && (
                        <CardItem
                          translateZ="50"
                          className="w-full md:w-1/3 rounded-lg overflow-hidden h-full"
                        >
                          <Image
                            src={`https://blogchain.onrender.com${post.imageUrl}`}
                            alt="Article image"
                            className="object-cover w-full h-full"
                            width={300}
                            height={290}
                          />
                        </CardItem>
                      )}
                      <CardItem
                        translateZ="50"
                        className={`flex-1 md:ml-4 mt-4 md:mt-0 flex flex-col justify-between ${
                          !post.imageUrl ? "md:ml-0" : ""
                        }`}
                      >
                        <div>
                          <div className="flex items-center mb-2">
                            <Image
                              src="/default-avatar.png"
                              alt="Author image"
                              className="w-10 h-10 rounded-full"
                              width={40}
                              height={40}
                            />
                            <span className="ml-2 text-lg font-semibold">
                              {post.author
                                ? post.author.usuario
                                : "Unknown Author"}
                            </span>
                            <span className="ml-4 px-2 py-1 bg-secondary text-secondary-foreground rounded-full">
                              {post.category
                                ? post.category.name
                                : "Uncategorized"}
                            </span>
                          </div>
                          <h2 className="text-2xl font-bold mb-2 truncate">
                            {post.title}
                          </h2>
                          <p
                            className="text-muted-foreground mb-4 line-clamp-3"
                            dangerouslySetInnerHTML={{
                              __html: post.description,
                            }}
                          ></p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-muted-foreground">
                            <span>10 min read</span>
                            <span className="mx-2">|</span>
                            <span className="flex items-center">
                              <FaComment className="w-5 h-5 mr-1" />5
                            </span>
                            <span className="flex items-center ml-4">
                              <FaHeart className="w-5 h-5 mr-1" />
                              11
                            </span>
                          </div>
                          <Link href={`/posts/${post.id}`}>
                            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-primary/80">
                              Read More
                            </button>
                          </Link>
                        </div>
                      </CardItem>
                    </div>
                  </CardBody>
                </CardContainer>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">No posts available</div>
          )}
          <div className="pagination-container flex justify-center mt-8">
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
