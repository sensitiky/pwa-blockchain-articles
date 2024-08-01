import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaRegComment, FaRegHeart } from "react-icons/fa";
import Link from "next/link";
import axios from "axios";
import parse from "html-react-parser";
import { useAuth } from "../../context/authContext";

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
  author?: {
    id: number;
    user: string;
    firstName: string;
    lastName: string;
    twitter?: string;
    linkedin?: string;
    facebook?: string;
  };
  category?: Category;
  tags: { name: string }[];
  comments: Comment[];
  favorites: number;
};

type Comment = {
  id: number;
  content: string;
  createdAt: string;
  author: {
    id: number;
    firstName: string;
    lastName: string;
  };
  favorites: number;
};

const POSTS_PER_PAGE = 5;

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 1500,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const countWords = (text: string) => {
  if (!text) return 0;
  return text.split(/\s+/).filter((word) => word.length > 0).length;
};

const calculateReadingTime = (text: string) => {
  const wordsPerMinute = 200;
  const numberOfWords = countWords(text);
  return Math.ceil(numberOfWords / wordsPerMinute);
};

const ArticleCarousel = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [comments, setComments] = useState<Comment[]>([]);
  const [post, setPost] = useState<Post | null>(null);
  const [sortOrder, setSortOrder] = useState<string>("recent");

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

  const handleFavorite = async (postId: number, commentId?: number) => {
    if (!user) {
      console.error("User is not logged in");
      alert("You need to be authenticated in order to interact");
      return;
    }
    try {
      await axios.post(`http://localhost:4000/favorites`, {
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
        setPost((prevPost) =>
          prevPost ? { ...prevPost, favorites: prevPost.favorites + 1 } : null
        );
      }
    } catch (error) {
      console.error("Error favoriting post or comment:", error);
    }
  };

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage, sortOrder]);

  return (
    <div className="py-16 px-4 md:px-8 z-10">
      <div
        data-aos="fade-in"
        data-aos-once="true"
        data-aos-anchor-placement="top-bottom"
        data-aos-offset="200"
      >
        <h2 className="text-3xl font-bold text-center text-customColor-innovatio3 mb-8">
          Last published articles
        </h2>
        <Slider {...settings}>
          {posts.map((post, index) => (
            <div key={index} className="p-4 flex justify-center">
              <div className="bg-opacity-50 backdrop-blur-3xl bg-white p-6 rounded-xl border-[1px] border-black min-h-[250px] max-h-[250px] overflow-hidden grid grid-rows-[auto,auto,1fr,auto] gap-2 w-full max-w-md">
                <div className="overflow-hidden">
                  {post.imageUrl && (
                    <div className="relative w-full h-40">
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                      />
                    </div>
                  )}
                </div>
                <div className="overflow-hidden">
                  <h2 className="text-xl font-semibold truncate">
                    {post.title}
                  </h2>
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm text-gray-900 line-clamp-3">
                    {parse(post.description)}
                  </p>
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-500">
                        {calculateReadingTime(post.description)} min read
                      </span>
                      <span className="bg-gray-500 w-px h-6"></span>
                      <button className="flex items-center space-x-1 text-gray-500">
                        <FaRegComment className="w-5 h-5" />
                        <span>
                          {Array.isArray(post.comments)
                            ? post.comments.length
                            : 0}
                        </span>
                      </button>
                      <button
                        className="flex items-center space-x-1 text-gray-500"
                        onClick={() => handleFavorite(post.id)}
                      >
                        <FaRegHeart className="w-5 h-5" />
                        <span>
                          {Array.isArray(post.favorites)
                            ? post.favorites.length
                            : 0}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default ArticleCarousel;
