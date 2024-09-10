"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Header from "@/assets/header";
import Image from "next/image";
import Footer from "@/assets/footer";
import axios from "axios";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { ArrowLeftIcon } from "lucide-react";
import { useAuth } from "../../../../context/authContext";
import DeletePostModal from "@/assets/deletepost";
import styled from "styled-components";
import parse, { DOMNode, domToReact, Element } from "html-react-parser";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 1rem;
  background-color: inherit;
`;

interface Post {
  id: number;
  title: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  description: string;
  author?: Author;
  category?: { name: string };
  tags: Tag[];
  comments: Comment[];
  favorites: number;
  commentscount: number;
}

interface Tag {
  id: number;
  name: string;
}

interface Author {
  id: number;
  user: string;
  firstName: string;
  lastName: string;
  bio: string;
  twitter?: string;
  linkedin?: string;
  facebook?: string;
  avatar?: string;
  role: string;
}

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author: {
    id: number;
    firstName: string;
    lastName: string;
    user: string;
    avatar?: string;
    role?: string;
  };
  favorites: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL_DEV;

const PostPage = () => {
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteComments, setFavoriteComments] = useState<{
    [key: number]: boolean;
  }>({});
  const router = useRouter();
  const { id } = useParams();

  const fetchPost = async (id: string) => {
    try {
      const response = await axios.get(`${API_URL}/posts/${id}`);
      const postData = response.data;
      //console.log(response.data);
      setPost(postData);
      setComments(postData.comments || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching post data:", error);
      setLoading(false);
    }
  };

  const fetchComments = async (postId: string) => {
    try {
      const response = await axios.get(`${API_URL}/comments/post/${postId}`);
      const commentsData: Comment[] = response.data;
      //console.log("Comments data:", commentsData);
      setComments(commentsData);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.error("User is not logged in");
      alert("You need to be authenticated in order to interact");
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/comments`, {
        content: commentContent,
        authorId: user.id,
        postId: post?.id,
      });

      const newComment = {
        ...response.data,
        author: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          user: user.user,
          avatar: user.avatar,
          role: user.role,
        },
      };

      setComments([...comments, newComment]);
      setCommentContent("");
    } catch (error) {
      console.error("Error posting comment:", error);
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
        setFavoriteComments((prev) => ({
          ...prev,
          [commentId]: true,
        }));
      } else {
        setPost((prevPost) =>
          prevPost ? { ...prevPost, favorites: prevPost.favorites + 1 } : null
        );
      }
    } catch (error) {
      console.error("Error favoriting post or comment:", error);
    }
  };

  const handleFavoriteClick = async () => {
    if (post) {
      await handleFavorite(post.id);
    }
    setIsFavorited(true);
  };

  const handleDelete = async () => {
    if (!user) {
      console.error("User is not logged in");
      alert("You need to be authenticated to delete the post");
      return;
    }
    try {
      await axios.delete(`${API_URL}/posts/${id}`);
      alert("Post deleted successfully!");
      router.push("/articles");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Error deleting post");
    }
  };

  useEffect(() => {
    if (id) {
      fetchPost(id as string);
      fetchComments(id as string);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col space-y-3">
        <Container>
          <Image
            src="/Logo-blogchain.png"
            width={300}
            height={300}
            alt="Blogchain Logo"
            className="animate-bounce"
          />
        </Container>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col space-y-3">
        <Container>
          <Image
            src="/Logo-blogchain.png"
            width={300}
            height={300}
            alt="Blogchain Logo"
            className="animate-bounce"
          />
        </Container>
      </div>
    );
  }

  const countWords = (text: string) => {
    if (!text) return 0;
    return text.split(/\s+/).filter((word) => word.length > 0).length;
  };

  const calculateReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const numberOfWords = countWords(text);
    return Math.ceil(numberOfWords / wordsPerMinute);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const parseHtmlContent = (htmlContent: string) => {
    return parse(htmlContent, {
      replace: (domNode) => {
        if (domNode instanceof Element) {
          const { tagName, attribs } = domNode;

          // Estilo general para elementos de bloque
          const blockStyle = {
            whiteSpace: "pre-wrap", // Mantiene saltos de línea y espacios
            fontFamily: "Gilroy, sans-serif", // Aplica la fuente Gilroy
            lineHeight: "1.6", // Asegura un espacio adecuado entre líneas
            marginBottom: "1rem", // Asegura espacio entre párrafos
          };

          // Aplicar estilo para respetar los saltos de línea y espacios a otros elementos de bloque
          if (["p", "div", "span", "h1", "h2", "h3"].includes(tagName)) {
            return (
              <div style={blockStyle} {...attribs}>
                {domToReact(domNode.children as DOMNode[])}
              </div>
            );
          }

          // Especialmente para elementos <br> que deben generar un salto de línea
          if (tagName === "br") {
            return <br />;
          }

          // Elementos permitidos
          if (
            tagName === "iframe" ||
            ["b", "strong", "i", "em", "a"].includes(tagName)
          ) {
            return domToReact([domNode] as DOMNode[]);
          }
        }
      },
    });
  };

  const handleGoBack = () => {
    const referrer = document.referrer;
    if (referrer.includes(`/posts/edit/${id}`)) {
      router.push("/articles");
    } else {
      router.back();
    }
  };

  const avatarUrl = post.author?.avatar
    ? post.author.avatar.startsWith("http")
      ? post.author.avatar
      : `${API_URL}${post.author.avatar}`
    : "default-avatar.webp";

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <Header />
      <div className="px-4 py-20 md:px-6 lg:py-2">
        <div className="mx-auto max-w-4xl">
          <button
            className="hover:underline bg-inherit mt-10 mb-10 text-black inline-flex h-8 items-start justify-center rounded-md px-4 text-sm font-medium transition-colors hover:bg-inherit focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            onClick={handleGoBack}
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Go Back
          </button>
          <div className="flex flex-col sm:flex-row items-center mb-6 space-y-4 sm:space-y-0 justify-between">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 justify-between w-full">
              <div className="flex items-center space-x-4">
                <Avatar className="size-12">
                  <AvatarImage
                    src={avatarUrl}
                    alt={`${post.author?.firstName}'s avatar`}
                  />
                  <AvatarFallback>{post.author?.user}</AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left">
                  <p className="text-base font-medium text-black">
                    {post.author?.user ?? "Author"}
                  </p>
                  <p className="text-base text-gray-500 line-clamp-2">
                    {post.author?.role}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {post.author?.twitter && (
                  <Link
                    href={post.author.twitter}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <FaTwitter className="size-7 text-black mr-10" />
                    <span className="sr-only">Twitter</span>
                  </Link>
                )}
                {post.author?.linkedin && (
                  <Link
                    href={post.author.linkedin}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <FaLinkedin className="size-7 text-black mr-10" />
                    <span className="sr-only">LinkedIn</span>
                  </Link>
                )}
                {post.author?.facebook && (
                  <Link
                    href={post.author.facebook}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <FaFacebook className="size-7 text-black mr-10" />
                    <span className="sr-only">Facebook</span>
                  </Link>
                )}
              </div>

              {user?.id === post.author?.id && (
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    className="w-fit flex items-center space-x-1 text-gray-500 hover:bg-inherit"
                    onClick={() => router.push(`/posts/edit/${post.id}`)}
                  >
                    <FaEdit className="size-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-fit flex items-center space-x-1 text-gray-500 hover:bg-inherit"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <FaTrash className="size-5" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          <p className="text-gray-500 mt-4">
            {formatDate(post.createdAt)} •{" "}
            {calculateReadingTime(post.description)} min read
          </p>
          <h1 className="text-4xl font-serif font-bold text-center mt-6">
            {post.title}
          </h1>
          {post.imageUrl && (
            <div className="mt-6 rounded-lg overflow-hidden">
              <Image
                src={post.imageUrl}
                alt="Banner"
                width={1200}
                height={300}
                className="w-full object-cover"
              />
            </div>
          )}
          <div className="prose prose-lg mx-auto mt-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              {parseHtmlContent(post.description)}
            </div>
          </div>
          {post.category && (
            <div className="mt-8 w-fit">
              <span className="flex items-center px-2 py-1 bg-[#000916] text-white rounded-full">
                <img
                  src="/category-white.png"
                  className="w-4 h-4 mr-2"
                  alt="Category Icon"
                />
                {post.category ? post.category.name : "Uncategorized"}
              </span>
            </div>
          )}
          {post.tags && (
            <div className="mt-8">
              <ul className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <li
                    key={index}
                    className="flex items-center px-2 py-1 bg-[#000916] text-white rounded-full"
                  >
                    <img
                      className="w-4 h-4 mr-2 filter invert"
                      src="/tag-svgrepo-com.png"
                      alt="Tag icon"
                    />
                    {tag ? tag.name : "Uncategorized"}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex flex-col sm:flex-row items-start mt-8 space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              className="w-fit flex items-center space-x-1"
              onClick={handleFavoriteClick}
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
                    stroke={isFavorited ? "#007BFF" : "#6b7280"}
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />{" "}
                </g>
              </svg>
            </button>
            <div className="w-fit flex items-center space-x-1 text-gray-500">
              <img src="/comment.png" alt="Comment" className="w-5 h-5" />
              <span>{post.commentscount || 0}</span>
            </div>
          </div>
          <div className="flex w-full justify-center">
            <div className="mt-20 w-[30rem] justify-center bg-[#000916]/20 h-[0.1rem]"></div>
          </div>
          <div className="mt-8">
            {comments.map((comment) => {
              const author = comment.author || {
                firstName: "Unknown",
                lastName: "User",
                avatar: "default-avatar.webp",
              };

              const avatarUrl = author.avatar?.startsWith("/")
                ? `${API_URL}${author.avatar}`
                : author.avatar;

              const authorName = `${author.user} `;

              return (
                <div
                  key={comment.id}
                  className="border rounded-md p-4 my-4 bg-gray-100"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={avatarUrl} alt="Author avatar" />
                      <AvatarFallback>{author.user}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{authorName}</p>
                      <p className="text-sm text-gray-500 font-light">
                        {author.role}
                      </p>
                      <div className="text-xs text-gray-500">
                        {formatDate(comment.createdAt)}
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 ml-5 text-sm">{comment.content}</p>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-2">
                    <Button
                      variant="ghost"
                      className="flex w-fit items-center rounded-full space-x-1"
                      onClick={() => handleFavorite(post.id, comment.id)}
                    >
                      <svg
                        width="25px"
                        height="25px"
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
                            d="M15.7 4C18.87 4 21 6.98 21 9.76C21 15.39 12.16 20 12 20C11.84 20 3 15.39 3 9.76C3 6.98 5.13 4 8.3 4C10.12 4 11.31 4.91 12 5.71C12.69 4.91 13.88 4 15.7 4Z"
                            fill={
                              favoriteComments[comment.id]
                                ? "#D22B2B"
                                : "#6b7280"
                            }
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />{" "}
                        </g>
                      </svg>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <form onSubmit={handleCommentSubmit} className="mt-4">
            <textarea
              className="w-full border rounded-md p-2 resize-none"
              placeholder="Add a comment"
              rows={5}
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
            />
            <Button
              type="submit"
              className="mt-2 border-none rounded-full bg-[#000916] text-white hover:bg-[#000916]/80"
            >
              Submit
            </Button>
          </form>
        </div>
      </div>
      <Footer />
      {isModalOpen && (
        <DeletePostModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default PostPage;
