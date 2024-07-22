"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookie from "universal-cookie";
import Header from "@/assets/header";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";
import ArticleCarousel from "@/assets/carousel";
import LoginCard from "@/assets/login";
import Footer from "@/assets/footer";
import axios from "axios";
import parse from "html-react-parser";
import { FaRegComment, FaRegHeart } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";

const API_URL = process.env.NEXT_PUBLIC_API_URL_DEV;
const cookies = new Cookie();

interface Post {
  id: number;
  title: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  description: string | object;
  author?: Author;
  category?: { name: string };
  tags: { name: string }[];
  comments: Comment[];
  favorites: number;
}

interface Author {
  id: number;
  usuario: string;
  firstName: string;
  lastName: string;
  bio: string;
  twitter?: string;
  linkedin?: string;
  facebook?: string;
  avatar?: string;
}

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author: { id: number; firstName: string; lastName: string; usuario: string };
  favorites: number;
}

interface Tag {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

const POSTS_PER_PAGE = 6;

const HomePage: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ username: string; id: number } | null>(
    null
  );
  const [showLoginCard, setShowLoginCard] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const router = useRouter();

  useEffect(() => {
    const token = cookies.get("token");
    if (token) {
      fetchUserSession(token);
    }

    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });

    fetchTags();
    fetchCategories();
    fetchPosts();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [selectedTagId, selectedCategoryId]);

  const fetchTags = async () => {
    try {
      const response = await axios.get(`${API_URL}/tags`);
      setTags(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching tags", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  const fetchPosts = async () => {
    try {
      const url = selectedTagId
        ? `${API_URL}/posts/by-tag?limit=${POSTS_PER_PAGE}&tagId=${selectedTagId}`
        : selectedCategoryId
        ? `${API_URL}/posts/by-category?limit=${POSTS_PER_PAGE}&categoryId=${selectedCategoryId}`
        : `${API_URL}/posts?limit=${POSTS_PER_PAGE}`;
      const response = await axios.get(url);
      const postsData = response.data.data;
      setPosts(postsData || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setLoading(false);
    }
  };

  const fetchUserSession = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/users/session`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        console.error("Failed to fetch user session");
      }
    } catch (error) {
      console.error("Error fetching user session:", error);
    }
  };

  const handleFavorite = async (postId: number, commentId?: number) => {
    if (!user) {
      console.error("User is not logged in");
      alert("You need to be authenticated in order to interact");
      return;
    }
    try {
      await axios.post(`${API_URL}/favorites`, {
        userId: user.id,
        postId: commentId ? undefined : postId,
        commentId: commentId || undefined,
        isFavorite: true,
      });

      if (commentId) {
        const updatedComments = comments.map((comment) =>
          comment.id === commentId
            ? { ...comment, favorites: comment.favorites + 1 }
            : comment
        );
        setComments(updatedComments);
      } else {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? { ...post, favorites: post.favorites + 1 }
              : post
          )
        );
      }
    } catch (error) {
      console.error("Error favoriting post or comment:", error);
    }
  };

  const handleCloseModal = () => {
    setShowLoginCard(false);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleTagClick = (tagId: number) => {
    const newTagId = selectedTagId === tagId ? null : tagId;
    setSelectedTagId(newTagId);
    console.log(newTagId);
  };

  const handleCategoryClick = (categoryId: number) => {
    const newCategoryId = selectedCategoryId === categoryId ? null : categoryId;
    setSelectedCategoryId(newCategoryId);
  };

  return (
    <div className="min-w-screen">
      <Header />

      <div className="relative h-screen flex items-center justify-center bg-customColor-header">
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-white to-transparent z-0"></div>
        <div
          className="relative z-10"
          data-aos="fade-in"
          data-aos-once="true"
          data-aos-anchor-placement="top-bottom"
          data-aos-offset="200"
        >
          <h1 className="text-center text-yellow-400 text-2xl sm:text-3xl md:text-4xl">
            Welcome to Blogchain
          </h1>
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-center text-white font-bold mt-4">
            A place where we write <br />
            articles about blockchain
            <br />
            to discuss
          </h2>
          <div className="text-center mt-8 flex justify-center">
            <Image
              src="/Hero.png"
              alt="Hero Image"
              height={1000}
              width={1000}
              className="w-full max-w-sm sm:max-w-md md:max-w-lg"
            />
          </div>
        </div>
      </div>

      <section className="flex bg-gradientbg2 py-4 px-4 md:px-8">
        <div
          className="container mx-auto text-center"
          data-aos="fade-in"
          data-aos-once="true"
          data-aos-anchor-placement="top-bottom"
          data-aos-offset="200"
        >
          <div className="grid gap-8 mb-24 sm:grid-cols-1 md:grid-cols-2">
            <div className="text-center flex flex-col justify-center">
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-semibold mb-4 text-customColor-innovatio3">
                Read, write, share and discuss blockchain
              </h1>
            </div>
            <div className="text-left">
              <p className="text-base sm:text-lg md:text-lg mb-12 text-customColor-innovatio3">
                Blogchain is an educational space to connect web3 content
                writers and readers interested in blockchain technology and its
                adoption. We are looking to fill with educational, journalistic
                and informative articles about this broad subject, submit your
                articles, meet your new "influencers" and stay tuned to the
                latest news in this world, welcome to blogchain.
              </p>
            </div>
          </div>
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-3">
            <div>
              <h2 className="text-right text-2xl sm:text-3xl md:text-4xl text-customColor-letras">
                Blogchainer Redactor
              </h2>
              <p className="text-right mt-4 text-base sm:text-lg md:text-lg text-customColor-innovatio3">
                Are you a writer of educational, academic, informative, review,
                tutorial content and want to expand your readership? Write or
                import your articles in our blog, make yourself known and flood
                your readers with knowledge.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <Image
                src="/Drafthero.png"
                alt="DraftHero"
                height={1000}
                width={1000}
                className="w-full max-w-sm sm:max-w-md md:max-w-lg"
              />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl text-customColor-letras">
                Web3 Lector
              </h2>
              <p className="mt-4 text-base sm:text-lg md:text-lg text-customColor-innovatio3">
                Are you a reader enthusiastic about blockchain technology and
                Web3 applications? Soak up the knowledge of many content
                creators, follow your influencers and stay tuned for all the
                updates in this space.
              </p>
            </div>
          </div>
        </div>
      </section>

      <ArticleCarousel />

      <section className="bg-gradientbg2 py-16 px-4 md:px-8">
        <div
          className="container mx-auto"
          data-aos="fade-in"
          data-aos-once="true"
          data-aos-anchor-placement="top-bottom"
          data-aos-offset="200"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-customColor-innovatio3 mb-14">
              Discover Articles
            </h2>
          </div>
          <div className="flex flex-wrap justify-between mb-8">
            <div className="flex flex-col w-full sm:w-auto mb-4 md:mb-0">
              <select
                className="py-2 border-b-2 border-t-2 border-l-0 bg-inherit border-r-0 focus:ring-0 border-customColor-innovatio3 focus:border-customColor-innovatio3 text-base sm:text-lg"
                onChange={(e) => handleCategoryClick(parseInt(e.target.value))}
              >
                <option value="">Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col w-full sm:w-auto mb-4 md:mb-0">
              <select
                className="py-2 border-b-2 border-t-2 border-l-0 bg-inherit border-r-0 focus:ring-0 border-customColor-innovatio3 focus:border-customColor-innovatio3 text-base sm:text-lg"
                onChange={(e) => handleTagClick(parseInt(e.target.value))}
              >
                <option value="">Tags</option>
                {tags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2">
            {posts.map((post, index) => (
              <div
                key={index}
                className="flex flex-col border-b border-customColor-innovatio3 pb-4 mb-4"
              >
                <div className="flex items-start mb-4">
                  {post.author?.avatar && (
                    <Image
                      src={`https://blogchain.onrender.com${post.author.avatar}`}
                      alt={post.author.firstName[0] ?? "Author"}
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                  )}
                  <div className="ml-4">
                    <p className="text-lg font-semibold">
                      {post.author?.firstName} {post.author?.lastName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(post.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {post.imageUrl && (
                    <Image
                      src={`https://blogchain.onrender.com${post.imageUrl}`}
                      alt={post.title}
                      width={100}
                      height={100}
                      className="rounded-md"
                    />
                  )}
                  <div className="ml-4">
                    <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                    <p className="text-gray-600 line-clamp-3">
                      {typeof post.description === "string"
                        ? parse(post.description)
                        : JSON.stringify(post.description)}
                    </p>
                  </div>
                </div>
                <div className="flex mt-2 items-center space-x-1">
                  <FaRegHeart className="h-5 w-5 text-gray-500" />
                  <span>
                    {Array.isArray(post.favorites) ? post.favorites.length : 0}
                  </span>
                  <Separator
                    className="h-5 w-[1px] bg-gray-500"
                    orientation="vertical"
                  />

                  <FaRegComment className="w-5 h-5 text-gray-500" />
                  <span>
                    {" "}
                    {Array.isArray(post.comments) ? post.comments.length : 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/articles">
              <Button className="px-6 py-2 border-2 text-black bg-inherit border-black hover:bg-customColor-innovatio3 hover:text-customColor-innovatio rounded-full">
                View All
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <Footer />

      {showLoginCard && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white p-8 rounded-lg shadow-lg">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            <LoginCard onClose={handleCloseModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
