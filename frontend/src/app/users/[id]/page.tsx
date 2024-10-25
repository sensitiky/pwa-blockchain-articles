"use client";

import React, { useEffect, useState, Suspense } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import DOMPurify from "dompurify";
import {
  FaFacebook,
  FaHeart,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";
import {
  ArrowLeftIcon,
  ClockIcon,
  MessageCircleIcon,
  TagIcon,
  UserIcon,
} from "lucide-react";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Header from "@/assets/header";
import Footer from "@/assets/footer";
import LoginCard from "@/assets/login";
import { User, Post } from "@/interfaces/interfaces2";

const API_URL = process.env.NEXT_PUBLIC_API_URL_DEV;

const UserContent: React.FC<{ userId: string }> = ({ userId }) => {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const [userResponse, postsResponse] = await Promise.all([
        axios.get(`${API_URL}/users/${userId}`),
        axios.get(`${API_URL}/posts/by-user/${userId}`),
      ]);

      setUser(userResponse.data);
      setPosts(convertImageBuffersToBase64(postsResponse.data));
    } catch (err) {
      handleFetchError(err);
    } finally {
      setLoading(false);
    }
  };

  const convertImageBuffersToBase64 = (posts: Post[]) => {
    return posts.map((post) => {
      if (post.imageUrl?.type === "Buffer") {
        const base64String = Buffer.from(post.imageUrl.data).toString("base64");
        post.imageUrlBase64 = `data:image/jpeg;base64,${base64String}`;
      }
      return post;
    });
  };

  const handleFetchError = (err: unknown) => {
    if (axios.isAxiosError(err)) {
      console.error("Error fetching user data:", err.message);
      setError("Failed to load data");
    } else {
      console.error("Unknown error:", err);
      setError("An unknown error occurred");
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="w-full min-h-screen flex items-start justify-center py-10">
      <div className="container max-w-5xl grid grid-cols-1 md:grid-cols-5 gap-2 px-4 md:px-0">
        <UserProfile user={user} router={router} />
        <div className="h-full col-span-1 bg-gray-200 w-[1px] m-4" />
        <PostList posts={posts} user={user} />
      </div>
    </div>
  );
};

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center align-middle h-screen p-1 bg-inherit">
    <Image
      src="/BLOGCHAIN.gif"
      width={200}
      height={200}
      alt="Blogchain Logo"
      className="animate-bounce"
    />
  </div>
);

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="text-red-500">{message}</div>
);
const UserProfile: React.FC<{ user: User | null; router: any }> = ({
  user,
  router,
}) => {
  const avatarUrl = user?.avatar
    ? user.avatar.startsWith("http")
      ? user.avatar
      : `${API_URL}${user.avatar}`
    : "default-avatar.webp";

  return (
    <div className="rounded-2xl p-6 flex flex-col items-center gap-4 col-span-1 bg-inherit mt-2">
      <BackButton onClick={() => router.back()} />
      <Avatar className="w-32 h-32 border-4 border-gray-300">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback>{user?.user}</AvatarFallback>
      </Avatar>
      <UserInfo user={user} />
      <SocialLinks user={user} />
    </div>
  );
};

const BackButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    className="flex items-center hover:underline bg-inherit text-black h-8 rounded-md px-4 text-sm font-medium transition-colors hover:bg-inherit focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
    onClick={onClick}
  >
    <ArrowLeftIcon className="mr-2 h-4 w-4" />
    Go Back
  </button>
);

const UserInfo: React.FC<{ user: User | null }> = ({ user }) => (
  <div className="text-center space-y-2 w-fit">
    <h2 className="text-2xl font-bold">{user?.user}</h2>
    <p
      className="text-gray-600 text-lg leading-relaxed text-left"
      style={{ whiteSpace: "pre-wrap" }}
      dangerouslySetInnerHTML={{ __html: formatBio(user?.bio ?? "") }}
    />
  </div>
);

const SocialLinks: React.FC<{ user: User | null }> = ({ user }) => (
  <div className="flex items-center gap-4">
    {user?.facebook && (
      <SocialLink
        href={user.facebook}
        icon={<FaFacebook className="w-6 h-6" />}
      />
    )}
    {user?.instagram && (
      <SocialLink
        href={user.instagram}
        icon={<FaInstagram className="w-6 h-6" />}
      />
    )}
    {user?.twitter && (
      <SocialLink
        href={user.twitter}
        icon={<FaTwitter className="w-6 h-6" />}
      />
    )}
    {user?.linkedin && (
      <SocialLink
        href={user.linkedin}
        icon={<FaLinkedin className="w-6 h-6" />}
      />
    )}
  </div>
);

const SocialLink: React.FC<{ href: string; icon: React.ReactNode }> = ({
  href,
  icon,
}) => (
  <Link href={href} className="text-primary" prefetch={false}>
    {icon}
  </Link>
);

const PostList: React.FC<{ posts: Post[]; user: User | null }> = ({
  posts,
  user,
}) => (
  <div className="flex flex-col space-y-6 col-span-3">
    {posts.map((post) => (
      <PostCard key={post.id} post={post} user={user} />
    ))}
  </div>
);

const PostCard: React.FC<{ post: Post; user: User | null }> = ({
  post,
  user,
}) => (
  <div className="bg-inherit flex-col w-full h-full rounded-none p-6 border-b-2 transition-transform duration-300 ease-in-out transform hover:scale-105">
    <PostImage imageUrl={post.imageUrlBase64} />
    <div className="mt-4 space-y-2">
      <PostMeta post={post} user={user} />
      <h3 className="text-lg font-semibold">{post.title}</h3>
      <PostDescription description={post.description} />
      <PostStats post={post} />
      <ReadMoreButton postId={post.id} />
    </div>
  </div>
);

const PostImage: React.FC<{ imageUrl?: string }> = ({ imageUrl }) =>
  imageUrl ? (
    <Image
      src={imageUrl}
      alt="Post Image"
      width={1920}
      height={1080}
      className="object-contain"
      loading="lazy"
    />
  ) : (
    <div className="w-full h-48 bg-gray-200 rounded-lg" />
  );

const PostMeta: React.FC<{ post: Post; user: User | null }> = ({
  post,
  user,
}) => (
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
      <span key={tag.id} className="flex flex-row">
        <TagIcon className="w-4 h-4 mr-2" />
        {tag.name}
      </span>
    ))}
  </div>
);

const PostDescription: React.FC<{ description: string }> = ({
  description,
}) => (
  <p
    className="text-muted-foreground line-clamp-2"
    dangerouslySetInnerHTML={{
      __html: DOMPurify.sanitize(description, {
        ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p"],
        ALLOWED_ATTR: ["href"],
      }),
    }}
  />
);

const PostStats: React.FC<{ post: Post }> = ({ post }) => (
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
);

const ReadMoreButton: React.FC<{ postId: number }> = ({ postId }) => (
  <Link href={`/posts/${postId}`}>
    <Button
      variant="link"
      className="flex justify-end text-white mt-2 bg-[#000916] rounded-full w-fit"
    >
      Read Article
    </Button>
  </Link>
);

const formatBio = (bioText: string) => {
  const urlRegex = /((https?:\/\/|www\.)[^\s]+)/g;
  let formattedText = bioText.replace(
    urlRegex,
    (url) =>
      `<a href="${url}" style="color: blue;" target="_blank" rel="noopener noreferrer">${url}</a>`
  );
  formattedText = formattedText.replace(
    /\n/g,
    '<br style="margin-bottom: 1rem;">'
  );
  return formattedText.replace(/\t/g, "&emsp;");
};

const Owner: React.FC = () => {
  const { id } = useParams();
  const userId = Array.isArray(id) ? id[0] : id;
  const [showLoginCard, setShowLoginCard] = useState(false);

  if (!id) return <div>User ID is missing</div>;

  return (
    <>
      <Header />
      <Suspense fallback={<LoadingSpinner />}>
        <UserContent userId={userId} />
      </Suspense>
      <Footer setShowLoginModal={setShowLoginCard} />
      {showLoginCard && <LoginModal onClose={() => setShowLoginCard(false)} />}
    </>
  );
};

const LoginModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="w-screen fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="relative bg-white p-8 rounded-lg shadow-lg">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        <img
          src="/close-circle-svgrepo-com.png"
          alt="Remove"
          className="size-7 cursor-pointer hover:animate-pulse"
        />
      </button>
      <LoginCard onClose={onClose} />
    </div>
  </div>
);

export default Owner;
