"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { FaComment, FaHeart } from "react-icons/fa";
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
import Link from "next/link";

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
      const response = await axios.get("http://localhost:4000/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  const fetchPosts = async (page: number, categoryId?: number) => {
    try {
      const url = categoryId
        ? `http://localhost:4000/posts/by-category?page=${page}&limit=${POSTS_PER_PAGE}&categoryId=${categoryId}&sortOrder=${sortOrder}`
        : `http://localhost:4000/posts?page=${page}&limit=${POSTS_PER_PAGE}&sortOrder=${sortOrder}`;
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

          <div className="flex flex-wrap items-center justify-center mt-4 space-x-4">
            <div
              ref={categoriesRef}
              className="categories-list flex flex-wrap justify-center gap-4 w-full px-2"
            >
              {categories.length > 0 ? (
                categories.map((category) => (
                  <button
                    key={category.id}
                    className={`category-item w-auto px-4 py-2 border border-white rounded-full text-white bg-inherit ${
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
                <div
                  key={post.id}
                  className="max-w-4xl mx-auto p-4 bg-card text-card-foreground border border-r-0 border-l-0 rounded-none shadow-none w-full transition-transform"
                >
                  <div className="flex flex-col md:flex-row h-full">
                    {post.imageUrl && (
                      <Image
                        src={`http://localhost:4000${post.imageUrl}`}
                        alt="Article image"
                        className="w-full md:w-1/3 rounded-lg object-cover"
                        width={300}
                        height={290}
                      />
                    )}
                    <div className="flex-1 md:ml-4 mt-4 md:mt-0 flex flex-col justify-between">
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
                          Learn More
                        </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
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
