"use client";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import axios from "axios";
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
import { useParams } from "next/navigation";
import { ClockIcon, TagIcon, MessageSquareIcon, HeartIcon } from "lucide-react";
import DOMPurify from "dompurify";
import Image from "next/image";
import styled from "styled-components";
import { CircularProgress } from "@mui/material";
import { useAuth } from "../../../context/authContext";

type Category = {
  id: number;
  name: string;
};

interface Post {
  id: number;
  title: string;
  content: string;
  imageUrlBase64: string | null;
  createdAt: string;
  description: string;
  author?: { id: number; user: string; avatar?: string; bio: string };
  category?: Category;
  comments: Comment[];
  favorites: number;
  tags: Tag[];
}

interface Tag {
  id: number;
  name: string;
}

const POSTS_PER_PAGE = 7;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 1rem;
  background-color: inherit;
`;

export default function Articles() {
  const categoriesRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [tags, setTags] = useState<Tag[]>([]);
  const API_URL = process.env.NEXT_PUBLIC_API_URL_PROD;
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [sortOrder, setSortOrder] = useState<string>("recent");
  const [categoryCounts, setCategoryCounts] = useState<
    { categoryId: number; count: number }[]
  >([]);
  const { token } = useAuth();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [categoriesResponse, postCountsResponse] = await Promise.all([
          axios.get(`${API_URL}/categories`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/posts/count/by-category`),
        ]);
        setCategories(categoriesResponse.data);
        setCategoryCounts(postCountsResponse.data);
        fetchPosts();
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchInitialData();
  }, [token]);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const url = selectedCategoryId
        ? `${API_URL}/posts/by-category?categoryId=${selectedCategoryId}`
        : `${API_URL}/posts`;
      const response = await axios.get(url);
      const postsData = response.data.data || [];
      setPosts(postsData);
      setTotalPages(Math.ceil(postsData.length / POSTS_PER_PAGE));
    } catch (error) {
      console.error("Error fetching posts", error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategoryId]);

  const fetchTagsByCategory = useCallback(async (categoryId: number) => {
    try {
      const response = await axios.get(
        `${API_URL}/tags/by-category/${categoryId}`
      );
      setTags(response.data);
    } catch (error) {
      console.error("Error fetching tags", error);
    }
  }, []);

  const handleCategoryClick = useCallback(
    (categoryId: number) => {
      const newCategoryId =
        selectedCategoryId === categoryId ? null : categoryId;
      setSelectedCategoryId(newCategoryId);
      setCurrentPage(1);
      setTags([]);
      if (newCategoryId !== null) {
        fetchTagsByCategory(newCategoryId);
      } else {
        setTags([]);
      }
      fetchPosts();
    },
    [fetchTagsByCategory, fetchPosts, selectedCategoryId]
  );

  const handleSortOrderChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSortOrder(e.target.value);
      setCurrentPage(1);
    },
    []
  );

  const handleResetSortOrder = useCallback(() => {
    setSortOrder("recent");
    setCurrentPage(1);
  }, []);

  const imageUrl = useCallback((post: Post) => post.imageUrlBase64 || "", []);

  const calculateReadingTime = useCallback((text: string) => {
    const wordsPerMinute = 200;
    const numberOfWords = text.split(/\s+/).length;
    return Math.ceil(numberOfWords / wordsPerMinute);
  }, []);

  const sortedPosts = useMemo(() => {
    return posts.slice().sort((a, b) => {
      const aContentLength = a.content?.length || 0;
      const bContentLength = b.content?.length || 0;

      switch (sortOrder) {
        case "recent":
          return Number(new Date(b.createdAt)) - Number(new Date(a.createdAt));
        case "saved":
          return b.favorites - a.favorites;
        case "comment":
          return b.comments.length - a.comments.length;
        case "less_than_1000":
          return aContentLength - bContentLength;
        case "1000_to_2000":
          return (
            Math.abs(1500 - aContentLength) - Math.abs(1500 - bContentLength)
          );
        case "2000_and_above":
          return bContentLength - aContentLength;
        default:
          return 0;
      }
    });
  }, [posts, sortOrder]);

  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    return sortedPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  }, [sortedPosts, currentPage]);

  return (
    <div className="articles-container flex flex-col min-h-screen w-screen z-auto">
      <Header />
      <div className="articles-header w-screen bg-customColor-header text-center py-8 px-4">
        <div className="articles-title-container py-12">
          <h1 className="articles-title text-4xl font-bold text-yellow-500">
            Articles
          </h1>
        </div>
        <div className="categories-container text-center py-4 w-full">
          <h3 className="categories-title text-xl font-medium text-white">
            Categories
          </h3>
          <div className="flex flex-wrap justify-center mt-4 space-x-4">
            <div
              ref={categoriesRef}
              className="categories-list flex flex-wrap justify-center gap-4 w-full px-2"
            >
              {categories.length > 0 ? (
                categories.map((category) => {
                  const count =
                    categoryCounts.find((c) => c.categoryId === category.id)
                      ?.count || 0;
                  return (
                    <button
                      key={category.id}
                      className={`ios-button ${
                        selectedCategoryId === category.id ? "selected" : ""
                      }`}
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      {category.name} ({count})
                    </button>
                  );
                })
              ) : (
                <div className="text-white">No categories available</div>
              )}
            </div>
          </div>
        </div>
        {tags.length > 0 && (
          <div className="categories-tags-container text-center py-4 w-full">
            <h3 className="tags-title text-xl font-medium text-white">Tags</h3>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {tags.map((tag) => (
                <span key={tag.id} className="ios-tag">
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="flex justify-center w-full lg:w-auto py-4">
          <button
            className="p-2 bg-inherit text-white rounded w-full lg:w-fit hover:bg-white hover:text-black transition-colors duration-300"
            onClick={handleResetSortOrder}
          >
            <svg
              className="fill-current text-white hover:text-black"
              width="24"
              height="24"
              viewBox="0 0 21 21"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                transform="matrix(0 1 1 0 2.5 2.5)"
              >
                <path d="m3.98652376 1.07807068c-2.38377179 1.38514556-3.98652376 3.96636605-3.98652376 6.92192932 0 4.418278 3.581722 8 8 8s8-3.581722 8-8-3.581722-8-8-8" />
                <path d="m4 1v4h-4" transform="matrix(1 0 0 -1 0 6)" />
              </g>
            </svg>
          </button>
        </div>
        <div className="sort-order-container flex flex-col lg:flex-row items-center text-center">
          <div className="flex flex-col justify-start py-4 px-4 lg:px-44 flex-shrink w-full lg:w-auto">
            <label htmlFor="sortOrder1" className="text-white">
              Sort by:
            </label>
            <select
              id="sortOrder1"
              className="ml-2 p-2 rounded w-full lg:w-fit ios-select text-black"
              value={sortOrder}
              onChange={handleSortOrderChange}
            >
              <option value="recent">Most Recents</option>
              <option value="saved">Most Saved</option>
              <option value="comment">More Comments</option>
            </select>
          </div>
          <div className="flex flex-col justify-start py-4 px-4 lg:px-44 flex-shrink w-full lg:w-auto">
            <label htmlFor="sortOrder2" className="text-white">
              Sort by:
            </label>
            <select
              id="sortOrder2"
              className="p-2 rounded w-full lg:w-fit ios-select text-black"
              value={sortOrder}
              onChange={handleSortOrderChange}
            >
              <option value="less_than_1000">Less than 1000 characters</option>
              <option value="1000_to_2000">1000 to 2000 characters</option>
              <option value="2000_and_above">2000 and above characters</option>
            </select>
          </div>
        </div>
      </div>
      <div className="articles-content flex-grow flex justify-center py-8 px-4 bg-inherit">
        <div className="bg-inherit posts-container w-full max-w-screen-lg mx-auto px-2 sm:px-4">
          {loading ? (
            <Container>
              <CircularProgress />
            </Container>
          ) : paginatedPosts.length > 0 ? (
            <div className="posts-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 gap-6 bg-inherit shadow-none">
              {paginatedPosts.map((post) => (
                <div
                  id={`responsive-post-container-${post.id}`}
                  key={post.id}
                  className="p-4 sm:p-6 bg-inherit mx-auto text-card-foreground border border-r-0 border-l-0 rounded-none shadow-none transition-transform ios-style"
                >
                  <div className="flex flex-col h-full">
                    {post.imageUrlBase64 && (
                      <Image
                        src={imageUrl(post)}
                        alt="Post Image"
                        width={1200}
                        height={300}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}
                    <div className="flex justify-between mt-2">
                      <div className="flex items-center">
                        <Link href={`/users/${post.author?.id}`}>
                          <img
                            src={
                              post.author?.avatar
                                ? post.author.avatar.startsWith("http")
                                  ? post.author.avatar
                                  : `${API_URL}${post.author.avatar}`
                                : "/default-avatar.jpg"
                            }
                            alt="Author image"
                            className="w-10 h-10 rounded-full"
                          />
                        </Link>
                        <div className="flex-col flex ml-2">
                          <span className="text-lg font-semibold">
                            {post.author ? post.author.user : "Unknown Author"}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {post.author ? post.author.bio : "Unknown Author"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <TagIcon className="w-4 h-4 mr-1" />
                        {post.tags
                          .slice(0, 3)
                          .map((tag) => tag.name)
                          .join(", ")}
                      </div>
                    </div>
                    <div className="flex-1 mt-4">
                      <h2 className="text-2xl font-bold mb-2 truncate">
                        {post.title}
                      </h2>
                      <p
                        className="text-muted-foreground mb-4 line-clamp-3"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(post.description, {
                            ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p"],
                            ALLOWED_ATTR: ["href"],
                          }),
                        }}
                      ></p>
                    </div>
                    <div className="flex items-center text-muted-foreground mt-4">
                      <ClockIcon className="w-5 h-5 mr-1" />
                      <span>
                        {calculateReadingTime(post.description)} min read
                      </span>
                      <span className="mx-2">|</span>
                      <MessageSquareIcon className="w-5 h-5 mr-1" />
                      <span>
                        {Array.isArray(post.comments)
                          ? post.comments.length
                          : 0}
                      </span>
                      <span className="mx-2">|</span>
                      <HeartIcon className="w-5 h-5 mr-1" />
                      <span>
                        {Array.isArray(post.favorites)
                          ? post.favorites.length
                          : 0}
                      </span>
                    </div>
                    <div className="flex justify-end mt-4">
                      <Link href={`/posts/${post.id}`}>
                        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-primary/80">
                          Read More
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-white">No posts available</div>
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
