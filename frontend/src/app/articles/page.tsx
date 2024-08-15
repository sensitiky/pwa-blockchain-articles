"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import Header from "@/assets/header";
import Footer from "@/assets/footer";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ClockIcon, TagIcon } from "lucide-react";
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
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [tags, setTags] = useState<Tag[]>([]);
  const API_URL = process.env.NEXT_PUBLIC_API_URL_PROD;
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [sortOrder, setSortOrder] = useState<string>("recent");
  const { token } = useAuth();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [categoriesResponse] = await Promise.all([
          axios.get(`${API_URL}/categories`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setCategories(categoriesResponse.data);
        fetchPosts(1, "recent");
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchInitialData();
  }, [token]);

  const fetchPosts = useCallback(
    async (page: number, order: string) => {
      setLoading(true);
      try {
        const url = selectedCategoryId
          ? `${API_URL}/posts/by-category?categoryId=${selectedCategoryId}&page=${page}&limit=${POSTS_PER_PAGE}&order=${order}`
          : `${API_URL}/posts?page=${page}&limit=${POSTS_PER_PAGE}&order=${order}`;
        const response = await axios.get(url);
        const postsData = response.data.data || [];

        setPosts((prevPosts) => [...prevPosts, ...postsData]);
        setHasMore(postsData.length === POSTS_PER_PAGE);
        setCurrentPage(page);
      } catch (error) {
        console.error("Error fetching posts", error);
      } finally {
        setLoading(false);
      }
    },
    [selectedCategoryId]
  );

  const handleCategoryClick = useCallback(
    (categoryId: number) => {
      setSelectedCategoryId(categoryId);
      setPosts([]);
      setCurrentPage(1);
      fetchPosts(1, sortOrder);
    },
    [fetchPosts, sortOrder]
  );

  const handleSortOrderChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSortOrder(e.target.value);
      setPosts([]);
      fetchPosts(1, e.target.value);
    },
    [fetchPosts]
  );

  const handleResetSortOrder = useCallback(() => {
    setSortOrder("recent");
    setPosts([]);
    fetchPosts(1, "recent");
  }, [fetchPosts]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 200
      ) {
        if (!loading && hasMore) {
          fetchPosts(currentPage + 1, sortOrder);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchPosts, hasMore, loading, currentPage, sortOrder]);

  const calculateReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const numberOfWords = text.split(/\s+/).length;
    return Math.ceil(numberOfWords / wordsPerMinute);
  };

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
                categories.map((category) => (
                  <button
                    key={category.id}
                    className={`ios-button ${
                      selectedCategoryId === category.id ? "selected" : ""
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
      </div>
      <div className="sort-order-container flex flex-col lg:flex-row items-center text-center">
        <div className="flex flex-col justify-start py-4 px-4 lg:px-44 flex-shrink w-full lg:w-auto">
          <label htmlFor="sortOrder1" className="text-primary">
            Sort by:
          </label>
          <select
            id="sortOrder1"
            className="ml-2 p-2 border w-full lg:w-fit ios-select text-black"
            value={sortOrder}
            onChange={handleSortOrderChange}
          >
            <option value="recent">Most Recents</option>
            <option value="saved">Most Saved</option>
            <option value="comment">More Comments</option>
          </select>
        </div>
        <div className="flex flex-col justify-start py-4 px-4 lg:px-44 flex-shrink w-full lg:w-auto">
          <label htmlFor="sortOrder2" className="text-primary">
            Sort by:
          </label>
          <select
            id="sortOrder2"
            className="p-2 w-full lg:w-fit ios-select text-black"
            value={sortOrder}
            onChange={handleSortOrderChange}
          >
            <option value="less_than_1000">Less than 1000 characters</option>
            <option value="1000_to_2000">1000 to 2000 characters</option>
            <option value="2000_and_above">2000 and above characters</option>
          </select>
        </div>
      </div>
      <div className="articles-content flex-grow flex justify-center py-8 px-4 bg-inherit">
        <div className="bg-inherit posts-container w-full max-w-screen-lg mx-auto px-2 sm:px-4">
          {posts.length > 0 ? (
            <div className="posts-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 gap-6 bg-inherit shadow-none">
              {posts.map((post) => (
                <div
                  id={`responsive-post-container-${post.id}`}
                  key={post.id}
                  className="p-4 sm:p-6 bg-inherit mx-auto text-card-foreground border border-r-0 border-l-0 rounded-none shadow-none transition-transform ios-style"
                >
                  <div className="flex flex-col h-full">
                    {post.imageUrlBase64 && (
                      <Image
                        src={post.imageUrlBase64}
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
                      <img
                        src="/comment.png"
                        alt="Comment"
                        className="w-5 h-5 mr-1"
                      />
                      <span>
                        {Array.isArray(post.comments)
                          ? post.comments.length
                          : 0}
                      </span>
                      <span className="mx-2">|</span>
                      <img
                        src="/saved-svgrepo-com.png"
                        alt="Saved"
                        className="w-5 h-5 mr-1"
                      />
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
            <div className="text-center text-white">
              {loading ? "Loading posts..." : "No posts available"}
            </div>
          )}
          {loading && (
            <div className="flex justify-center mt-8">
              <CircularProgress />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
