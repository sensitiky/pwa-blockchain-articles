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
import parse from "html-react-parser";
import { useAuth } from "../../../../context/authContext";
import DeletePostModal from "@/assets/deletepost";
import styled from "styled-components";
import { CircularProgress } from "@mui/material";

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
  const router = useRouter();
  const { id } = useParams();

  const fetchPost = async (id: string) => {
    try {
      const response = await axios.get(`${API_URL}/posts/${id}`);
      const postData = response.data;
      setPost(postData);
      setComments(postData.comments);
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
      // console.log("Comments data:", commentsData);
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
      } else {
        setPost((prevPost) =>
          prevPost ? { ...prevPost, favorites: prevPost.favorites + 1 } : null
        );
      }
    } catch (error) {
      console.error("Error favoriting post or comment:", error);
    }
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
          <CircularProgress />
        </Container>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col space-y-3">
        <Container>
          <CircularProgress />
        </Container>
      </div>
    );
  }

  const countWords = (text: string) => {
    if (!text) return 0;
    return text.split(/\s+/).filter((word) => word.length > 0).length;
  };

  const tagMap = {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    p: "p",
    b: "b",
    strong: "strong",
    i: "i",
    em: "em",
    mark: "mark",
    small: "small",
    del: "del",
    ins: "ins",
    sub: "sub",
    sup: "sup",
  };

  const PostDescription = ({ description }: { description: string | null }) => {
    if (!description) {
      return (
        <div
          style={{ textIndent: "20px" }}
          className="text-lg justify-between"
        ></div>
      );
    }

    const transformedDescription = description
      .replace(/\.(?!\d)/g, ".")
      .replace(/\[(\w+)\](.*?)\[\/\1\]/g, (match, tagName, content) => {
        const htmlTagName =
          tagMap[tagName.toLowerCase() as keyof typeof tagMap];
        if (htmlTagName) {
          return `<${htmlTagName}>${content}</${htmlTagName}>`;
        }
        return match;
      });

    return (
      <div style={{ textIndent: "20px" }} className="text-lg justify-between">
        {parse(transformedDescription)}
      </div>
    );
  };

  const calculateReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const numberOfWords = countWords(text);
    return Math.ceil(numberOfWords / wordsPerMinute);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <Header />
      <div className="px-4 py-20 md:px-6 lg:py-2">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <button
              className="hover:underline bg-inherit text-black inline-flex h-8 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors hover:bg-inherit focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              onClick={() => router.push("/articles")}
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Go Back
            </button>

            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={`${API_URL}${post.author?.avatar}`} />
                <AvatarFallback>
                  {post.author ? (
                    <>
                      {post.author.firstName?.[0] ?? "A"}
                      {post.author.lastName?.[0] ?? "U"}
                    </>
                  ) : (
                    "AU"
                  )}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-black">
                  {post.author?.firstName ?? "Author"}{" "}
                  {post.author?.lastName ?? "Unknown"}
                </p>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {post.author?.bio}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {post.author?.twitter && (
                  <Link
                    href={post.author.twitter}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <FaTwitter className="h-5 w-5 text-black" />
                    <span className="sr-only">Twitter</span>
                  </Link>
                )}
                {post.author?.linkedin && (
                  <Link
                    href={post.author.linkedin}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <FaLinkedin className="h-5 w-5 text-black" />
                    <span className="sr-only">LinkedIn</span>
                  </Link>
                )}
                {post.author?.facebook && (
                  <Link
                    href={post.author.facebook}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <FaFacebook className="h-5 w-5 text-black" />
                    <span className="sr-only">Facebook</span>
                  </Link>
                )}
              </div>
              {user?.id === post.author?.id && (
                <>
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
                </>
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
              <PostDescription description={post.description} />
            </div>
          </div>
          {post.category && (
            <div className="mt-8">
              <span className="px-2 py-1 bg-[#000916] text-white rounded-full">
                <span className="text-white">#</span>
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
          <div className="flex items-center mt-8 space-x-4">
            <button
              className="w-fit flex items-center space-x-1"
              onClick={() => handleFavorite(post.id)}
            >
              <img
                src="/saved-svgrepo-com.png"
                alt="Saved"
                className="w-5 h-5"
              />
              <span>
                {Array.isArray(post.favorites) ? post.favorites.length : 0}
              </span>
            </button>
            <button className="w-fit flex items-center space-x-1 text-gray-500">
              <img src="/comment.png" alt="Comment" className="w-5 h-5" />
              <span>
                {Array.isArray(post.comments) ? post.comments.length : 0}
              </span>
            </button>
          </div>
          <div className="flex w-full justify-center">
            <div className="mt-20 w-[30rem] justify-center bg-[#000916]/20 h-[0.1rem]"></div>
          </div>
          <div className="mt-8">
            {comments.map((comment) => {
              const author = comment.author || {
                firstName: "Unknown",
                lastName: "User",
                avatar: "/default-avatar.png",
              };

              const avatarUrl = author.avatar?.startsWith("/")
                ? `${API_URL}${author.avatar}`
                : author.avatar;

              const authorName = `${author.firstName} ${author.lastName}`;

              return (
                <div
                  key={comment.id}
                  className="border rounded-md p-4 my-4 bg-gray-100"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={avatarUrl} alt="Author avatar" />
                      <AvatarFallback>
                        {author.firstName[0]}
                        {author.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{authorName}</p>
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
                      <img
                        src="/saved-svgrepo-com.png"
                        alt="Saved"
                        className="w-4 h-4"
                      />
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

function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
}
