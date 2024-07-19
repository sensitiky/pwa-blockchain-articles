"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import Header from "@/assets/header";
import Image from "next/image";
import Footer from "@/assets/footer";
import axios from "axios";
import { FaFacebook } from "react-icons/fa";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeftIcon,
  HeartIcon,
  MessageCircleIcon,
  TwitterIcon,
  LinkedinIcon,
} from "lucide-react";

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
  author: { id: number; firstName: string; lastName: string };
  favorites: number;
}

export default function PostPage() {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const fetchPost = async (id: string) => {
    try {
      const response = await axios.get(`http://localhost:4000/posts/${id}`);
      const postData = response.data; // Acceder a la data correctamente
      setPost(postData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching post data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPost(id);
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

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <Header />
      <div className="px-4 py-2 md:px-6 lg:py-2">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between">
            <button
              className="bg-inherit text-black inline-flex h-8 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors hover:bg-inherit focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              onClick={() => router.back()}
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Go Back
            </button>
            <div className="flex items-center space-x-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>
                  {post.author?.firstName[0]}
                  {post.author?.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-black">
                  {post.author?.firstName} {post.author?.lastName}
                </p>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <time dateTime={post.createdAt}>
                    {formatDate(post.createdAt)}
                  </time>
                  <span>·</span>
                  <span>5 min read</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {post.author?.twitter && (
                  <Link
                    href={post.author.twitter}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <TwitterIcon className="h-5 w-5 text-black" />
                    <span className="sr-only">Twitter</span>
                  </Link>
                )}
                {post.author?.linkedin && (
                  <Link
                    href={post.author.linkedin}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <LinkedinIcon className="h-5 w-5 text-black" />
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
          {post.imageUrl && (
            <div className="mt-6 rounded-lg border">
              <Image
                src={post.imageUrl}
                alt="Banner"
                width={1200}
                height={300}
                className="aspect-[4/1] w-full object-cover"
              />
            </div>
          )}
          <div className="prose prose-gray mx-auto mt-8 dark:prose-invert">
            <h1>{post.title}</h1>
            <p>{post.content}</p>
            {post.category && (
              <div>
                <h3>Category:</h3>
                <p>{post.category.name}</p>
              </div>
            )}
            {post.tags.length > 0 && (
              <div>
                <h3>Tags:</h3>
                <ul>
                  {post.tags.map((tag, index) => (
                    <li key={index}>{tag.name}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <HeartIcon className="h-5 w-5" />
                <span className="sr-only">Favorites</span>
                <span>{post.favorites}</span>
              </Button>
            </div>
            <div className="mb-32 mt-8 rounded-lg border p-4">
              <h3 className="text-lg font-medium">Comments</h3>
              <Accordion type="single" collapsible className="mt-4 space-y-2">
                {post.comments.map((comment, index) => (
                  <AccordionItem value={`comment-${index}`} key={comment.id}>
                    <AccordionTrigger className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder-user.jpg" />
                          <AvatarFallback>
                            {comment.author.firstName[0]}
                            {comment.author.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">
                            {comment.author.firstName} {comment.author.lastName}
                          </p>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <time dateTime={comment.createdAt}>
                              {formatDate(comment.createdAt)}
                            </time>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground"></div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="mt-2 text-sm">{comment.content}</p>
                      <div className="mt-2 flex items-center space-x-4">
                        <Button variant="ghost" size="icon">
                          <HeartIcon className="h-4 w-4" />
                          <span className="sr-only">Reply</span>
                        </Button>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <time dateTime={comment.createdAt}>
                            {formatDate(comment.createdAt)}
                          </time>
                          <Button variant="ghost" size="icon">
                            <MessageCircleIcon className="h-4 w-4" />
                            <span className="sr-only">Like</span>
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
