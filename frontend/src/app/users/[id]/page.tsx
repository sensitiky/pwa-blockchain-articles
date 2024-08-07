"use client";

import React, { useEffect, useState, Suspense } from "react";
import axios from "axios";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Header from "@/assets/header";
import Footer from "@/assets/footer";
import { useParams } from "next/navigation";
import { CircularProgress } from "@mui/material";
import styled from "styled-components";
import {
  FaFacebook,
  FaHeart,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";
import { ClockIcon, MessageCircleIcon, TagIcon, UserIcon } from "lucide-react";
import Image from "next/image";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 1rem;
  background-color: inherit;
`;

interface User {
  firstName?: string;
  lastName?: string;
  date?: Date;
  email?: string;
  user?: string;
  country?: string;
  medium?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  bio?: string;
  avatar?: string;
  postCount?: number;
}

interface Post {
  id: number;
  title: string;
  content: string;
  imageUrlBase64?: string;
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
  const API_URL = process.env.NEXT_PUBLIC_API_URL_PROD;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API_URL}/users/${userId}`);
        const userData = response.data;
        setUser(userData);

        const postsResponse = await axios.get(
          `${API_URL}/posts?authorId=${userData.id}`
        );
        const postsData = postsResponse.data.data.map((post: any) => ({
          ...post,
          imageUrlBase64: post.imageUrl
            ? `data:image/jpeg;base64,${Buffer.from(
                post.imageUrl.data
              ).toString("base64")}`
            : null,
        }));
        setPosts(postsData);
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
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="w-full min-h-screen flex items-start justify-center py-10">
      <div className="container max-w-5xl grid grid-cols-1 md:grid-cols-5 gap-2 px-4 md:px-0">
        <div className="rounded-2xl p-6 flex flex-col items-center gap-4 col-span-1 shadow-none border-none bg-inherit">
          <Avatar className="w-32 h-32 border-4 border-gray-300">
            <AvatarImage src={`${API_URL}${user?.avatar}`} />
            <AvatarFallback>
              {user?.firstName && user.firstName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">{user?.user}</h2>
            <p className="text-muted-foreground">
              {user?.bio || "No bio available."}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {user?.facebook && (
              <Link
                href={user?.facebook}
                className="text-primary"
                prefetch={false}
              >
                <FaFacebook className="w-6 h-6" />
              </Link>
            )}
            {user?.instagram && (
              <Link
                href={user?.instagram}
                className="text-primary"
                prefetch={false}
              >
                <FaInstagram className="w-6 h-6" />
              </Link>
            )}
            {user?.twitter && (
              <Link
                href={user?.twitter}
                className="text-primary"
                prefetch={false}
              >
                <FaTwitter className="w-6 h-6" />
              </Link>
            )}
            {user?.linkedin && (
              <Link
                href={user?.linkedin}
                className="text-primary"
                prefetch={false}
              >
                <FaLinkedin className="w-6 h-6" />
              </Link>
            )}
          </div>
        </div>
        <Separator orientation="vertical" className="h-full col-span-1" />
        <div className="flex flex-col space-y-6 col-span-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-inherit rounded-none p-6 border-b-2 transition-transform duration-300 ease-in-out transform hover:scale-105"
            >
              <Image
                src={post.imageUrlBase64 || ""}
                width={400}
                height={225}
                alt="Article Image"
                className="w-full h-48 object-cover rounded-lg"
              />

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <UserIcon className="w-4 h-4" />
                  <span>{user?.user}</span>
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
                    <FaHeart className="w-4 h-4" />
                    <span>{post.favorites.length} likes</span>
                  </div>
                </div>
                <Link href={`/posts/${post.id}`}>
                  <Button variant="link" className="text-primary">
                    Read Article
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Owner: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OwnerContent />
    </Suspense>
  );
};

const OwnerContent: React.FC = () => {
  const { id } = useParams();
  const userId = Array.isArray(id) ? id[0] : id;

  if (!id) {
    return <div>User ID is missing</div>;
  }

  return (
    <>
      <Header />
      <UserContent userId={userId} />
      <Footer />
    </>
  );
};

export default Owner;
