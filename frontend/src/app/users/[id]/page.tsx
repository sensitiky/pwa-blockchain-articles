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
  imageUrl: { type: string; data: number[] } | null;
  imageUrlBase64?: string;
  category: { name: string };
  comments: { id: number; content: string }[];
  favorites: { id: number }[];
  createdAt: string;
  tags: { id: number; name: string }[];
}

const UserContent: React.FC<{ userId: string }> = ({ userId }) => {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL_DEV;

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Fetch user data
        const userResponse = await axios.get(`${API_URL}/users/${userId}`);
        setUser(userResponse.data);

        // Fetch posts filtered by userId
        const postsResponse = await axios.get(
          `${API_URL}/posts/by-user/${userId}`
        );

        //Convert image buffer to base64
        const postsWithBase64Images = postsResponse.data.map((post: Post) => {
          if (post.imageUrl && post.imageUrl.type === "Buffer") {
            const base64String = Buffer.from(post.imageUrl.data).toString(
              "base64"
            );
            post.imageUrlBase64 = `data:image/jpeg;base64,${base64String}`;
          }
          return post;
        });

        console.log(postsResponse.data);
        setPosts(postsWithBase64Images);
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
  }, [userId, API_URL]);

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

  const formatBio = (bioText: string) => {
    const urlRegex = /((https?:\/\/|www\.)[^\s]+)/g;

    // Reemplaza URLs por enlaces azules
    let formattedText = bioText.replace(urlRegex, (url) => {
      return `<a href="${url}" style="color: blue;" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });

    // Reemplaza saltos de línea con <br> y aplica un estilo para añadir margen inferior
    formattedText = formattedText.replace(
      /\n/g,
      '<br style="margin-bottom: 1rem;">'
    );

    // Reemplaza tabulaciones con espacios en blanco
    formattedText = formattedText.replace(/\t/g, "&emsp;");

    return formattedText;
  };

  return (
    <div className="w-full min-h-screen flex items-start justify-center py-10">
      <div className="container max-w-5xl grid grid-cols-1 md:grid-cols-5 gap-2 px-4 md:px-0">
        <div className="rounded-2xl p-6 flex flex-col items-center gap-4 col-span-1 bg-inherit">
          <Avatar className="w-32 h-32 border-4 border-gray-300">
            <AvatarImage src={`${API_URL}${user?.avatar}`} />
            <AvatarFallback>
              {user?.firstName && user.firstName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="text-center space-y-2 w-fit">
            <h2 className="text-2xl font-bold">{user?.user}</h2>
            <p
              className="text-gray-600 text-lg leading-relaxed text-left"
              style={{ whiteSpace: "pre-wrap" }}
              dangerouslySetInnerHTML={{ __html: formatBio(user?.bio ?? "") }}
            ></p>
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
        <div className="h-full col-span-1 bg-gray-200 w-[1px] m-4" />
        <div className="flex flex-col space-y-6 col-span-3 ">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-inherit flex-col w-full h-full rounded-none p-6 border-b-2 transition-transform duration-300 ease-in-out transform hover:scale-105"
            >
              {post.imageUrlBase64 ? (
                <Image
                  src={post.imageUrlBase64}
                  alt="Post Image"
                  width={1920}
                  height={1080}
                  className="object-contain"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 rounded-lg"></div>
              )}

              <div className="mt-4 space-y-2 ">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <UserIcon className="w-4 h-4" />
                  <span>{user?.user}</span>
                  <Image
                    src="/category.png"
                    width={1920}
                    height={1080}
                    className="w-3 h-3 sm:w-4 sm:h-4 mr-1"
                    alt="Category"
                  />
                  <span>{post.category.name}</span>
                  {post.tags.map((tag) => (
                    <span key={tag.id} className="flex flex-row ">
                      <TagIcon className="w-4 h-4 mr-2" />
                      {tag.name}
                    </span>
                  ))}
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
                  <Button
                    variant="link"
                    className="flex justify-end text-white mt-2 bg-[#000916] rounded-full w-fit"
                  >
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
