"use client";
import { useEffect, useRef, useState } from "react";
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
import Image from "next/image";

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
  author?: { id: number; user: string; avatar?: string; bio: string };
  category?: { name: string };
  comments: Comment[];
  favorites: number;
  tags: Tag[];
};

interface Tag {
  id: number;
  name: string;
}

const POSTS_PER_PAGE = 5;

export default function Articles() {
  const categoriesRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [sortOrder, setSortOrder] = useState<string>("recent");
  const [categoryCounts, setCategoryCounts] = useState<
    { categoryId: number; count: number }[]
  >([]);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:4000/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  // Fetch posts by ID
  const fetchPost = async (id: string) => {
    try {
      const response = await axios.get(`http://localhost:4000/posts/${id}`);
      const postData = response.data;
      setPosts(postData);
      setComments(postData.comments);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching post data:", error);
      setLoading(false);
    }
  };

  // Fetch comments for a post
  const fetchComments = async (postId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/comments/post/${postId}`
      );
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // Fetch posts by category or page
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

  // Fetch post counts by category
  const fetchCategoryCounts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/posts/count-by-category"
      );
      setCategoryCounts(response.data);
    } catch (error) {
      console.error("Error fetching category counts", error);
    }
  };

  // Fetch tags by category
  const fetchTagsByCategory = async (categoryId: number) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/tags/by-category/${categoryId}`
      );
      setTags(response.data);
    } catch (error) {
      console.error("Error fetching tags", error);
    }
  };

  // Effect for fetching data based on params
  useEffect(() => {
    if (id) {
      fetchPost(id as string);
      fetchComments(id as string);
    }
  }, [id]);

  // Effect for fetching categories, category counts, and posts
  useEffect(() => {
    fetchCategories();
    fetchCategoryCounts();
    fetchPosts(currentPage, selectedCategoryId || undefined);
  }, [currentPage, selectedCategoryId, sortOrder]);

  // Handle category click to fetch tags and posts
  const handleCategoryClick = (categoryId: number) => {
    const newCategoryId = selectedCategoryId === categoryId ? null : categoryId;
    setSelectedCategoryId(newCategoryId);
    setCurrentPage(1);
    setTags([]);

    if (newCategoryId) {
      fetchTagsByCategory(newCategoryId);
      fetchPosts(1, newCategoryId);
    } else {
      fetchPosts(1);
    }
  };

  // Handle sort order change
  const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
    fetchPosts(1, selectedCategoryId || undefined);
  };

  return (
    <div className="articles-container flex flex-col min-h-screen">
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
                categories.map((category) => {
                  const count =
                    categoryCounts.find((c) => c.categoryId === category.id)
                      ?.count || 0;
                  return (
                    <button
                      key={category.id}
                      className={`category-item w-auto px-4 py-2 border border-white rounded-full text-white bg-inherit ${
                        selectedCategoryId === category.id
                          ? "bg-yellow-500 text-black"
                          : ""
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

          <div
            className={`categories-tags-container text-center py-4 w-full tags-container ${
              tags.length > 0 ? "visible" : ""
            }`}
          >
            <h3 className="tags-title text-xl font-medium text-white">Tags</h3>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  className="tag-item px-4 py-2 border border-white rounded-full text-white bg-gray-700"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="sort-order-container flex text-center">
          <div className="flex flex-col justify-start py-4 lg:px-[450px] flex-shrink">
            <label htmlFor="sortOrder" className="text-white">
              Sort by:
            </label>
            <select
              id="sortOrder"
              className="ml-2 p-2 rounded w-fit"
              value={sortOrder}
              onChange={handleSortOrderChange}
            >
              <option value="recent">Most Recents</option>
              <option value="saved">Most Saved</option>
              <option value="comment">More Comments</option>
            </select>
          </div>
          <div className="sort-order-container flex text-center ">
            <div className="flex flex-col  justify-end py-4 lg:px-[180px] flex-shrink">
              <label htmlFor="sortOrder" className="text-white">
                Sort by:
              </label>
              <select
                id="sortOrder"
                className="ml-2 p-2 rounded w-fit"
                value={sortOrder}
                onChange={handleSortOrderChange}
              >
                <option value="less_than_1000">
                  Less than 1000 characters
                </option>
                <option value="1000_to_2000">1000 to 2000 characters</option>
                <option value="2000_and_above">
                  2000 and above characters
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="articles-content flex-grow flex justify-center py-8 px-4 bg-inherit">
        <div className="bg-inherit posts-container w-full max-w-screen-lg mx-auto">
          {posts.length > 0 ? (
            <div className="posts-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 bg-inherit shadow-none">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="p-12 bg-inherit mx-auto text-card-foreground border border-r-0 border-l-0 rounded-none shadow-none w-full transition-transform"
                >
                  <div className="flex flex-col h-full">
                    {post.imageUrl && (
                      <Image
                        src={`http://localhost:4000${post.imageUrl}`}
                        alt="Article image"
                        className="w-full h-64 rounded-lg object-cover border-border border-gray-300"
                        width={1920}
                        height={1080}
                      />
                    )}
                    <div className="flex justify-between mt-2">
                      <div className="flex items-center">
                        <Link href={`/users/${post.author?.id}`}>
                          <Image
                            src={`http://localhost:4000${post.author?.avatar}`}
                            alt="Author image"
                            className="w-10 h-10 rounded-full"
                            width={40}
                            height={40}
                          />
                        </Link>
                        <div className="flex-col flex">
                          <span className="ml-2 text-lg font-semibold">
                            {post.author ? post.author.user : "Unknown Author"}
                          </span>
                          <span className="ml-2 text-sm text-muted-foreground">
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
                      <h2 className="text-3xl font-bold mb-2 truncate">
                        {post.title}
                      </h2>
                      <p
                        className="text-muted-foreground mb-4 line-clamp-3"
                        dangerouslySetInnerHTML={{
                          __html: post.description,
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
                    <div className="flex justify-end">
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

function calculateReadingTime(text: string) {
  const wordsPerMinute = 200;
  const numberOfWords = text.split(/\s+/).length;
  return Math.ceil(numberOfWords / wordsPerMinute);
}
