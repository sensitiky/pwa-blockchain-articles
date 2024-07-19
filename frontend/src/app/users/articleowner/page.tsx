"use client";

import React, { SVGProps, useEffect, useState, Suspense } from "react";
import axios from "axios";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Header from "@/assets/header";
import Footer from "@/assets/footer";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

interface User {
  id: number;
  usuario: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  bio?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
  category: { name: string };
  comments: { id: number; content: string }[];
  favorites: { id: number }[];
  createdAt: string;
}

const UserContent: React.FC<{ userId: string }> = ({ userId }) => {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `https://blogchain.onrender.com/users/${userId}`
        );
        const userData = response.data;
        setUser(userData);

        const postsResponse = await axios.get(
          `https://blogchain.onrender.com/posts?authorId=${userData.id}`
        );
        setPosts(postsResponse.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.error("Error fetching user data:", err.message);
          setError("Failed to load data");
        } else {
          console.error("Unknown error:", err);
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

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

  if (error) {
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

  return (
    <div className="w-full min-h-screen flex items-start justify-center py-10">
      <div className="container max-w-5xl grid grid-cols-1 md:grid-cols-5 gap-2 px-4 md:px-0">
        <div className="bg-background rounded-2xl p-6 flex flex-col items-center gap-4 col-span-1">
          <Avatar className="w-32 h-32 border-4 border-background">
            <AvatarImage src={user?.avatarUrl || "/placeholder-user.jpg"} />
            <AvatarFallback>
              {user?.firstName ? user.firstName[0] : user?.usuario[0]}
            </AvatarFallback>
          </Avatar>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">{user?.usuario}</h2>
            <p className="text-muted-foreground">
              {user?.bio || "No bio available."}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {user?.facebook && (
              <Link
                href={user.facebook}
                className="text-primary"
                prefetch={false}
              >
                <FacebookIcon className="w-6 h-6" />
              </Link>
            )}
            {user?.instagram && (
              <Link
                href={user.instagram}
                className="text-primary"
                prefetch={false}
              >
                <InstagramIcon className="w-6 h-6" />
              </Link>
            )}
            {user?.twitter && (
              <Link
                href={user.twitter}
                className="text-primary"
                prefetch={false}
              >
                <TwitterIcon className="w-6 h-6" />
              </Link>
            )}
            {user?.linkedin && (
              <Link
                href={user.linkedin}
                className="text-primary"
                prefetch={false}
              >
                <LinkedinIcon className="w-6 h-6" />
              </Link>
            )}
          </div>
        </div>
        <Separator orientation="vertical" className="h-full col-span-1" />
        <div className="flex flex-col space-y-6 col-span-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-background rounded-none p-6 border-b-2"
            >
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  width={400}
                  height={225}
                  alt="Article Image"
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <UserIcon className="w-4 h-4" />
                  <span>{user?.usuario}</span>
                  <Separator orientation="vertical" />
                  <TagIcon className="w-4 h-4" />
                  <span>{post.category.name}</span>
                </div>
                <h3 className="text-lg font-semibold">{post.title}</h3>
                <p className="text-muted-foreground line-clamp-2">
                  {post.content}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <ClockIcon className="w-4 h-4" />
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircleIcon className="w-4 h-4" />
                    <span>{post.comments.length} comments</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <HeartIcon className="w-4 h-4" />
                    <span>{post.favorites.length} likes</span>
                  </div>
                </div>
                <Button variant="link" className="text-primary">
                  Read Article
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Owner: React.FC = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  if (!userId) {
    return <div>User ID is missing</div>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Header />
      <UserContent userId={userId} />
      <Footer />
    </Suspense>
  );
};

export default Owner;

function ClockIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function FacebookIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function HeartIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function InstagramIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function MessageCircleIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}

function TagIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
      <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
    </svg>
  );
}

function TwitterIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

function UserIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function XIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
