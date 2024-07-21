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
  FaRegComment,
  FaRegHeart,
} from "react-icons/fa";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeftIcon } from "lucide-react";
import parse from "html-react-parser";
import { useAuth } from "../../../../context/authContext";

interface Post {
  id: number;
  title: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  description: string;
  author?: {
    id: number;
    usuario: string;
    firstName: string;
    lastName: string;
    bio: string;
    twitter?: string;
    linkedin?: string;
    facebook?: string;
  };
  category?: { name: string };
  tags: { name: string }[];
  comments: Comment[];
  favorites: number;
}

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author: { id: number; firstName: string; lastName: string; usuario: string };
  favorites: number;
}

const PostPage = () => {
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const router = useRouter();
  const { id } = useParams();

  const fetchPost = async (id: string) => {
    try {
      const response = await axios.get(`https://blogchain.onrender.com/posts/${id}`);
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
      const response = await axios.get(
        `https://blogchain.onrender.com/comments/post/${postId}`
      );
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    {
      if (!user) {
        console.error("User is not logged in");
        alert("You need to be authenticated in order to interact");
        return;
      }
    }
    try {
      const response = await axios.post(`https://blogchain.onrender.com/comments`, {
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
          usuario: user.usuario,
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
      await axios.post(`https://blogchain.onrender.com/favorites`, {
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
    if (id) {
      fetchPost(id as string);
      fetchComments(id as string);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
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

  const PostDescription = ({ description }: { description: string }) => {
    const transformedDescription = description
      .replace(/\.(?!\d)/g, ".<br/>")
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
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="px-4 py-2 md:px-6 lg:py-2">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between">
            <button
              className="hover:underline bg-inherit text-black inline-flex h-8 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors hover:bg-inherit focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              onClick={() => router.back()}
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Go Back
            </button>
            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/shadcn.jpg" />
                <AvatarFallback>
                  {post.author?.firstName?.[0] ?? "Author"}
                  {post.author?.lastName?.[0] ?? "Unknown"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-black">
                  {post.author?.firstName?.[0] ?? "Author"}{" "}
                  {post.author?.lastName?.[0] ?? "Unknown"}
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
            </div>
          </div>
          <p className="text-gray-500 mt-4">
            {formatDate(post.createdAt)} •{" "}
            {calculateReadingTime(post.description)} min read
          </p>
          <h1 className="text-3xl font-bold text-center mt-6">{post.title}</h1>
          {post.imageUrl && (
            <div className="mt-6 rounded-lg border">
              <Image
                src={`https://blogchain.onrender.com${post.imageUrl}`}
                alt="Banner"
                width={1200}
                height={300}
                className="aspect-[4/1] w-full object-cover"
              />
            </div>
          )}
          <div className="prose prose-gray mx-auto mt-8 dark:prose-invert">
            <PostDescription description={post.description} />
          </div>
          {post.category && (
            <div className="gap-6 p-6">
              <h3 className="text-lg px-2 py-1 mb-8 bg-secondary rounded-full w-fit h-fit">
                Category:
              </h3>
              <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full">
                {post.category ? post.category.name : "Uncategorized"}
              </span>
            </div>
          )}
          {post.tags && (
            <div className="gap-6 p-6">
              <h3 className="text-lg px-2 py-1 mb-8 bg-secondary rounded-full w-fit h-fit">
                Tags:
              </h3>
              <ul className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <li
                    key={index}
                    className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full"
                  >
                    {tag.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex items-center mt-8">
            <Button
              variant="ghost"
              className="w-fit flex items-center space-x-1"
              onClick={() => handleFavorite(post.id)}
            >
              <FaRegHeart className="h-5 w-5 text-gray-500" />
              <span>
                {Array.isArray(post.favorites) ? post.favorites.length : 0}
              </span>
            </Button>

            <Button
              className="w-fit flex items-center space-x-1 text-gray-500"
              variant="ghost"
            >
              <FaRegComment className="w-5 h-5" />
              <span>
                {Array.isArray(post.comments) ? post.comments.length : 0}
              </span>
            </Button>
          </div>
          <div className="mt-8">
            <h3 className="text-lg font-medium">Comments</h3>
            {comments.map((comment, index) => (
              <div
                key={index}
                className="border rounded-none border-none p-4 my-4 bg-gray-200"
              >
                <div className="flex items-center space-x-4">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>
                      {comment.author?.firstName?.[0]}
                      {comment.author?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {comment.author?.usuario}
                    </p>
                    <div className="text-xs text-gray-500">
                      {formatDate(comment.createdAt)}
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-sm">{comment.content}</p>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-2">
                  <Button
                    variant="ghost"
                    className="flex w-fit items-center rounded-full  space-x-1 "
                    onClick={() => handleFavorite(post.id, comment.id)}
                  >
                    <FaRegHeart className="h-4 w-4" />
                    <span className="ml-2">Favorite</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleCommentSubmit} className="mt-4">
            <textarea
              className="w-full border rounded-none p-2 resize-none"
              placeholder="Add a comment"
              rows={5}
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
            />
            <Button
              type="submit"
              className="mt-2 border-none rounded-none bg-gray-200 text-black hover:bg-black hover:text-gray-200"
            >
              Submit
            </Button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PostPage;
