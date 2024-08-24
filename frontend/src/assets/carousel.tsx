"use client";
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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
  imageUrlBase64?: string;
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
  favoritescount: number;
  commentscount: number;
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

const API_URL = process.env.NEXT_PUBLIC_API_URL_DEV;
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
        ? `${API_URL}/posts/by-category?page=${page}&limit=${POSTS_PER_PAGE}&categoryId=${categoryId}&sortOrder=${sortOrder}`
        : `${API_URL}/posts?page=${page}&limit=${POSTS_PER_PAGE}&sortOrder=${sortOrder}`;
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
        <h2 className="text-3xl font-bold text-center text-[#263238] mb-8">
          Last published articles
        </h2>
        <Slider {...settings}>
          {posts.map((post, index) => (
            <div key={index} className="p-4 flex justify-center">
              <div className="bg-opacity-50 backdrop-blur-3xl bg-white p-6 rounded-xl border border-[#263238] min-h-[250px] max-h-[250px] overflow-hidden grid grid-rows-[auto,auto,1fr,auto] gap-2 w-full max-w-md">
                <div className="overflow-hidden">
                  {post.imageUrlBase64 && (
                    <div className="relative w-full h-40">
                      <Image
                        src={post.imageUrlBase64}
                        alt={post.title}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                      />
                    </div>
                  )}
                </div>
                <div className="overflow-hidden">
                  <h2 className="text-xl font-semibold truncate text-[#263238]">
                    {post.title}
                  </h2>
                </div>
                <div className="overflow-hidden">
                  <div className="text-sm text-gray-900 line-clamp-3">
                    {parse(post.description)}
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-wrap items-center space-x-4">
                      <span className="text-gray-500">
                        {calculateReadingTime(post.description)} min read
                      </span>
                      <span className="bg-gray-500 w-px h-6 hidden sm:block"></span>
                      <div className="flex space-x-4">
                        <button className="flex items-center space-x-1 text-gray-500">
                          <img
                            src="/comment.png"
                            alt="Comment"
                            className="w-5 h-5 mr-1"
                          />
                          <span>{post.commentscount || 0}</span>
                        </button>
                        <button
                          className="flex items-center space-x-1 text-gray-500"
                          onClick={() => handleFavorite(post.id)}
                        >
                          <svg
                            width="1.5rem"
                            height="1.5rem"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g id="SVGRepo_bgCarrier" stroke-width="0" />

                            <g
                              id="SVGRepo_tracerCarrier"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />

                            <g id="SVGRepo_iconCarrier">
                              {" "}
                              <path
                                d="M19 19.2674V7.84496C19 5.64147 17.4253 3.74489 15.2391 3.31522C13.1006 2.89493 10.8994 2.89493 8.76089 3.31522C6.57467 3.74489 5 5.64147 5 7.84496V19.2674C5 20.6038 6.46752 21.4355 7.63416 20.7604L10.8211 18.9159C11.5492 18.4945 12.4508 18.4945 13.1789 18.9159L16.3658 20.7604C17.5325 21.4355 19 20.6038 19 19.2674Z"
                                stroke="#6b7280"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />{" "}
                            </g>
                          </svg>
                          <span>{post.favoritescount || 0}</span>
                        </button>
                      </div>
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
