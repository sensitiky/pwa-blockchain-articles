"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import Header from "@/assets/header";
import Footer from "@/assets/footer";
import Link from "next/link";
import { ClockIcon, TagIcon } from "lucide-react";
import DOMPurify from "dompurify";
import Image from "next/image";
import styled from "styled-components";
import { CircularProgress } from "@mui/material";
import { useAuth } from "../../../context/authContext";
import React from "react";

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

const Articles = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL_DEV;
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<string>("recent");
  const [sortOrder2, setSortOrder2] = useState<string>("short");
  const { token } = useAuth();
  const [categoryCounts, setCategoryCounts] = useState<
    { categoryId: number; count: number }[]
  >([]);
  const [tags, setTags] = useState<
    { tagId: number; name: string; count: number }[]
  >([]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  }, [API_URL, token]);

  const fetchPosts = useCallback(
    async (
      page: number,
      order: string,
      categoryId: number | null = null,
      tagId: number | null = null
    ) => {
      setLoading(true);
      try {
        let url = `${API_URL}/posts?page=${page}&limit=${POSTS_PER_PAGE}&order=${order}`;
        if (categoryId) {
          url = `${API_URL}/posts/by-category?categoryId=${categoryId}&page=${page}&order=${order}`;
        }
        if (tagId) {
          url = `${API_URL}/posts/by-tag?tagId=${tagId}&categoryId=${categoryId}&page=${page}&order=${order}`;
        }

        const response = await axios.get(url);
        let postsData = response.data.data || [];

        // Apply sortOrder2 logic after fetching the posts
        if (sortOrder2 === "short") {
          postsData = postsData.filter(
            (post: { description: string | any[] }) =>
              post.description.length <= 1000
          );
        } else if (sortOrder2 === "medium") {
          postsData = postsData.filter(
            (post: { description: string | any[] }) =>
              post.description.length > 1000 && post.description.length <= 3000
          );
        } else if (sortOrder2 === "long") {
          postsData = postsData.filter(
            (post: { description: string | any[] }) =>
              post.description.length > 3000
          );
        }

        setPosts((prevPosts) =>
          page === 1 ? postsData : [...prevPosts, ...postsData]
        );
        setHasMore(postsData.length > 0);
        setCurrentPage(page);
      } catch (error) {
        console.error("Error fetching posts", error);
      } finally {
        setLoading(false);
      }
    },
    [API_URL, sortOrder2]
  );

  const fetchCategoryCounts = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/posts/count-by-category"
      );
      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = response.data;
      setCategoryCounts(result);
    } catch (error) {
      console.error("Error fetching category counts:", error);
    }
  }, []);

  const fetchTags = useCallback(async (categoryId: number) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/posts/count-by-tag?categoryId=${categoryId}`
      );

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // The response should now include the correct structure with name
      // console.log("Raw Tags Response:", response.data);

      const tags = response.data.map((tag: any) => ({
        tagId: tag.tagId, // The 'tagId' should now be correctly populated
        name: tag.name, // The 'name' should now be correctly populated
        count: tag.count,
      }));

      // console.log("Processed Tags:", tags); // Verify the processed tags
      setTags(tags);
    } catch (error: any) {
      console.error("Error fetching tags:", error.message || error);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchCategoryCounts();
    fetchPosts(1, sortOrder);
  }, [fetchCategories, fetchCategoryCounts, fetchPosts, sortOrder]);

  const handleCategoryChange = useCallback(
    (categoryId: number | null) => {
      setSelectedCategoryId(categoryId);
      setSelectedTagId(null); // Reset selected tag when category changes
      setSortOrder("recent"); // Reset sort order to default when category changes
      setPosts([]);
      fetchPosts(1, "recent", categoryId);
      if (categoryId !== null) {
        fetchTags(categoryId);
      } else {
        setTags([]);
      }
    },
    [fetchPosts, fetchTags]
  );

  const handleTagChange = useCallback(
    (tagId: number | null) => {
      // Toggle the selection: if the tag is already selected, deselect it.
      setSelectedTagId((prevTagId) => (prevTagId === tagId ? null : tagId));
      setPosts([]);
      fetchPosts(1, "recent", selectedCategoryId, tagId);
    },
    [fetchPosts, selectedCategoryId]
  );

  const handleSortOrderChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newSortOrder = e.target.value;
      setSortOrder(newSortOrder);
      setPosts([]);
      fetchPosts(1, newSortOrder, selectedCategoryId, selectedTagId);
    },
    [fetchPosts, selectedCategoryId, selectedTagId]
  );

  const handleSortOrder2Change = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newSortOrder2 = e.target.value;
      setSortOrder2(newSortOrder2);
      setPosts([]); // Reset posts to refetch based on the new sort order
      fetchPosts(1, sortOrder, selectedCategoryId, selectedTagId); // Fetch with the updated sortOrder2
    },
    [fetchPosts, sortOrder, selectedCategoryId, selectedTagId]
  );
  const calculateReadingTime = useCallback((text: string) => {
    const wordsPerMinute = 200;
    const numberOfWords = text.split(/\s+/).length;
    return Math.ceil(numberOfWords / wordsPerMinute);
  }, []);

  const renderPosts = useMemo(() => {
    if (posts.length === 0 && !loading) {
      return <div className="text-center text-white">No posts available</div>;
    }

    return posts.map((post) => (
      <div
        key={post.id}
        className="w-full p-4 sm:p-6 bg-inherit mx-auto text-card-foreground border border-r-0 border-l-0 rounded-none shadow-none transition-transform ios-style"
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
                <span className="text-lg font-semibold text-[#263238]">
                  {post.author ? post.author.user : "Unknown Author"}
                </span>
                <span className="text-sm text-muted-foreground">
                  {post.author ? post.author.bio : "Unknown Author"}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-start">
              <div className="flex items-center mb-2">
                <span className="flex items-center text-[#263238]">
                  <span className="text-2xl">#</span> {post.category?.name}
                </span>
              </div>
              <div className="flex items-center text-[#263238]">
                <TagIcon className="w-4 h-4 mr-1" />
                {post.tags
                  .slice(0, 3)
                  .map((tag) => tag.name)
                  .join(", ")}
              </div>
            </div>
          </div>
          <div className="flex-1 mt-4">
            <h2 className="text-2xl font-bold mb-2 truncate text-[#263238]">
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
            <span>{calculateReadingTime(post.description)} min read</span>
            <span className="mx-2">|</span>
            <img src="/comment.png" alt="Comment" className="w-5 h-5 mr-1" />
            <span>
              {Array.isArray(post.comments) ? post.comments.length : 0}
            </span>
            <span className="mx-2">|</span>
            <img
              src="/saved-svgrepo-com.png"
              alt="Saved"
              className="w-5 h-5 mr-1"
            />
            <span>
              {Array.isArray(post.favorites) ? post.favorites.length : 0}
            </span>
          </div>
          <div className="flex justify-end mt-4">
            <Link href={`/posts/${post.id}`}>
              <button className="bg-[#000916] text-primary-foreground px-4 py-2 rounded-full hover:bg-[#000916]/80">
                Read More
              </button>
            </Link>
          </div>
        </div>
      </div>
    ));
  }, [posts, loading, API_URL, calculateReadingTime]);

  return (
    <div className="articles-container flex flex-col min-h-screen w-screen z-auto">
      <Header />
      <div className="articles-header w-screen bg-[#000916] text-center py-8 px-4">
        <div className="articles-title-container py-12">
          <h1 className="articles-title text-4xl font-bold text-yellow-500">
            Articles
          </h1>
        </div>
        <div className="categories-container text-center py-4 w-full">
          <h3 className="categories-title text-xl font-medium text-white mb-6">
            Categories
          </h3>
          <button
            className={`ios-button2 ${
              selectedCategoryId === null ? "selected" : ""
            }`}
            onClick={() => handleCategoryChange(null)}
          >
            All Categories
          </button>
          <div className="flex flex-wrap justify-center mt-4 space-x-4">
            {categories.length > 0 ? (
              categories.map((category) => {
                const categoryCount =
                  categoryCounts.find((item) => item.categoryId === category.id)
                    ?.count || 0;
                return (
                  <button
                    key={category.id}
                    className={`ios-button ${
                      selectedCategoryId === category.id ? "selected" : ""
                    }`}
                    onClick={() => handleCategoryChange(category.id)}
                  >
                    {category.name} ({categoryCount})
                  </button>
                );
              })
            ) : (
              <div className="text-white">No categories available</div>
            )}
          </div>
          {selectedCategoryId !== null && tags.length > 0 && (
            <div className="tags-container text-center py-4 w-full">
              <h3 className="tags-title text-lg font-medium text-white mb-4">
                Tags
              </h3>
              <div className="flex flex-wrap justify-center mt-2 space-x-4">
                {tags.map((tag) => (
                  <button
                    key={tag.tagId}
                    className={`ios-button ${
                      selectedTagId === tag.tagId ? "selected" : ""
                    }`}
                    onClick={() => handleTagChange(tag.tagId)}
                  >
                    {tag.name} ({tag.count})
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="sort-order-container flex flex-col lg:flex-row items-center text-center">
        <div className="flex flex-col justify-start py-4 px-4 lg:px-44 flex-shrink w-full lg:w-auto">
          <label htmlFor="sortOrder1" className="text-[#263238] font-bold">
            Sort by:
          </label>
          <select
            id="sortOrder1"
            className="ml-2 p-2 border w-full lg:w-fit ios-select text-black"
            value={sortOrder}
            onChange={handleSortOrderChange}
          >
            <option value="recent">Most Recent</option>
            <option value="saved">Most Saved</option>
            <option value="comment">Most Comments</option>
          </select>
        </div>
        <div className="flex flex-col justify-start py-4 px-4 lg:px-44 flex-shrink w-full lg:w-auto">
          <label htmlFor="sortOrder2" className="text-[#263238] font-bold">
            Sort by Length:
          </label>
          <select
            id="sortOrder2"
            className="ml-2 p-2 border w-full lg:w-fit ios-select text-black"
            value={sortOrder2}
            onChange={handleSortOrder2Change}
          >
            <option value="short">Short (≤ 1000 characters)</option>
            <option value="medium">Medium (1000-3000 characters)</option>
            <option value="long">Long (≥ 3000 characters)</option>
          </select>
        </div>
      </div>

      <div className="articles-content flex-grow flex justify-center py-8 px-4 bg-inherit">
        <div className="bg-inherit posts-container w-full max-w-screen-lg mx-auto px-2 sm:px-4">
          {loading ? (
            <div className="flex justify-center mt-8">
              <CircularProgress />
            </div>
          ) : (
            <div className="posts-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 gap-6 bg-inherit shadow-none">
              {renderPosts}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default React.memo(Articles);
