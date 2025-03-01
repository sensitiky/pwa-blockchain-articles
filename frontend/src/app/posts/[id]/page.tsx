'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Header from '@/assets/header';
import Image from 'next/image';
import Footer from '@/assets/footer';
import axios from 'axios';
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaEdit,
  FaTrash,
  FaInstagram,
  FaMedium,
  FaShare,
  FaComment,
  FaBookmark,
  FaTags,
} from 'react-icons/fa';
import { ArrowLeftIcon } from 'lucide-react';
import { useAuth } from '../../../../context/authContext';
import DeletePostModal from '@/assets/deletepost';
import styled from 'styled-components';
import parse, { DOMNode, domToReact, Element } from 'html-react-parser';
import LoginCard from '@/assets/login';
import ShareBar from '@/components/ui/sharebar';
import mixpanel from 'mixpanel-browser';

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
  isFavorited: boolean;
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
  stackernews?: string;
  facebook?: string;
  avatar?: string;
  role: string;
  instagram?: string;
  medium?: string;
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
}

const API_URL = process.env.NEXT_PUBLIC_API_URL_DEV;
const MIX_URL = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
const PostPage = () => {
  const { user, token } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLoginCard, setShowLoginCard] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [showBookmarkMessage, setShowBookmarkMessage] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showShareBar, setShowShareBar] = useState(false);
  const router = useRouter();
  const { id } = useParams();

  mixpanel.init(MIX_URL || '', { track_pageview: true });
  useEffect(() => {
    if (id) {
      fetchPost(id as string);
      fetchComments(id as string);
    }
  }, [id]);

  const fetchPost = async (id: string) => {
    try {
      const response = await axios.get(`${API_URL}/posts/${id}`);
      const postData = response.data;
      //console.log(postData);
      setPost(postData);
      setComments(postData.comments || []);
      setIsSaved(postData.isFavorited);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching post data:', error);
      setLoading(false);
    }
  };

  const fetchComments = async (postId: string) => {
    try {
      const response = await axios.get(`${API_URL}/comments/post/${postId}`);
      const commentsData: Comment[] = response.data;
      setComments(commentsData);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCommentSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user) {
        alert('You need to be authenticated to interact');
        return;
      }
      if (commentContent.length > 800) {
        alert('Comment exceeds the maximum length of 800 characters.');
        return;
      }
      try {
        const response = await axios.post(`${API_URL}/comments`, {
          content: commentContent,
          authorId: user.id,
          postId: post?.id,
        });

        const newComment: Comment = {
          id: response.data.id,
          content: response.data.content,
          author: {
            id: user.id,
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            user: user.user || '',
            avatar: user.avatar || '',
            role: user.role || '',
          },
          createdAt: response.data.createdAt,
        };
        // console.log(newComment);
        setComments((prev) => [...prev, newComment]);
        setCommentContent('');
      } catch (error) {
        console.error('Error posting comment:', error);
      }
    },
    [commentContent, user, post]
  );

  const handleDeleteComment = async (commentId: number, authorId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        alert('You need to be authenticated to delete the comment');
        return;
      }

      //  console.log('Attempting to delete comment', { commentId, authorId });

      const response = await axios.delete(`${API_URL}/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { userId: Number(authorId) },
      });

      //console.log('Delete response:', response);

      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId)
      );
      alert('Comment deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting comment:', error);
      alert('Error deleting comment');
    }
  };

  const handleFavorite = async (postId: number) => {
    if (!user) {
      console.error('User is not logged in');
      alert('You need to be authenticated in order to interact');
      return;
    }
    try {
      if (isSaved) {
        setIsSaved(false);
        setShowBookmarkMessage(false);
        const url = `${API_URL}/favorites`;
        /*      console.log('Deleting favorite with URL:', url, 'Params:', {
          userId: user.id,
          postId,
        });
          */
        await axios.delete(url, {
          params: { userId: user.id, postId },
        });

        setPost((prevPost) =>
          prevPost
            ? {
                ...prevPost,
                favorites: prevPost.favorites - 1,
                isFavorited: false,
              }
            : null
        );
      } else {
        const response = await axios.post(`${API_URL}/favorites`, {
          userId: user.id,
          postId,
          isFavorite: true,
        });

        setPost((prevPost) =>
          prevPost
            ? {
                ...prevPost,
                favorites: prevPost.favorites + 1,
                isFavorited: true,
              }
            : null
        );
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error favoriting post:', error);
    }
  };

  const handleFavoriteClick = async () => {
    if (!isSaved) {
      setShowBookmarkMessage(true);
      setTimeout(() => setShowBookmarkMessage(false), 1500);
    }
    if (post) {
      await handleFavorite(post.id);
    }
  };

  const handleDelete = async () => {
    if (!user || !token) {
      console.error('User is not logged in');
      alert('You need to be authenticated to delete the post');
      return;
    }
    // console.log(token);
    try {
      await axios.delete(`${API_URL}/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Post deleted successfully!');
      router.push('/articles');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting post');
    }
  };

  const handleCloseModal = () => {
    setShowLoginCard(false);
  };

  const handleGoBack = () => {
    const referrer = document.referrer;
    if (referrer.includes(`/posts/edit/${id}`)) {
      router.push('/articles');
    } else {
      router.back();
    }
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

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const parseHtmlContent = (htmlContent: string, post: any) => {
    return parse(htmlContent, {
      replace: (domNode) => {
        if (domNode instanceof Element) {
          const { tagName, attribs } = domNode;

          const blockStyle = {
            whiteSpace: 'pre-wrap',
            fontFamily: 'Gilroy, sans-serif',
            lineHeight: '1.6',
            marginBottom: '1rem',
          };

          if (['p', 'div', 'span', 'h1', 'h2', 'h3'].includes(tagName)) {
            return (
              <div className="prose" style={blockStyle} {...attribs}>
                {domToReact(domNode.children as DOMNode[])}
              </div>
            );
          }

          if (tagName === 'br') {
            return <br />;
          }

          if (['iframe', 'b', 'strong', 'i', 'em', 'a'].includes(tagName)) {
            if (tagName === 'a') {
              const linkType = 'External Post Link';
              const linkUrl = attribs.href;
              const timestamp = new Date().toISOString();

              const handleClick = () => {
                mixpanel.track('External Post Link Clicked', {
                  event: 'External Post Link Clicked',
                  link_url: linkUrl,
                  post_id: 'user_' + post?.author?.id,
                  timestamp: timestamp,
                  link_type: linkType,
                });
              };

              return (
                <a {...attribs} onClick={handleClick}>
                  {domToReact(domNode.children as DOMNode[])}
                </a>
              );
            }

            return domToReact([domNode] as DOMNode[]);
          }

          if (tagName === 'img') {
            return <img {...attribs} alt="" />;
          }
        }
      },
    });
  };

  const formatTags = (tags: any[]): string => {
    return (
      tags
        .map((tag) => {
          try {
            const parsedName = JSON.parse(tag.name);
            return parsedName.name;
          } catch (err) {
            return tag.name;
          }
        })
        .join(', ') || 'No tags'
    );
  };

  const handleShare = () => {
    setShowShareBar((prev) => !prev);
  };

  const handleSocialLinkClick = (event: any) => {
    const linkType = event.currentTarget.getAttribute('data-link-type');
    const linkUrl = event.currentTarget.href;
    const timestamp = new Date().toISOString();
    /*console.log('External Profile Link Clicked', {
      event: 'External Profile Link Clicked',
      link_url: linkUrl,
      user_id: 'user_' + post?.author?.id,
      timestamp: timestamp,
      link_type: linkType,
    });*/
    mixpanel.track('External Profile Link Clicked', {
      event: 'External Profile Link Clicked',
      link_url: linkUrl,
      user_id: 'user_' + post?.author?.id,
      timestamp: timestamp,
      link_type: linkType,
    });
  };

  const avatarUrl = post?.author?.avatar
    ? post.author.avatar.startsWith('http')
      ? post.author.avatar
      : `${API_URL}${post.author.avatar}`
    : 'default-avatar.webp';

  if (loading) {
    return (
      <div className="flex items-center justify-center bg-[#fefefe] w-screen h-screen">
        <Container>
          <Image
            src="/BLOGCHAIN.gif"
            width={200}
            height={200}
            alt="Blogchain Logo"
            className="animate-bounce rounded-full"
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
            src="/BLOGCHAIN.gif"
            width={200}
            height={200}
            alt="Blogchain Logo"
            className="animate-bounce rounded-full"
          />
        </Container>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <header>
        <Header />
      </header>
      <main className="px-4 py-20 md:px-6 lg:py-2">
        <div className="mx-auto max-w-4xl">
          <button
            className="hover:underline bg-inherit mt-10 mb-10 text-black inline-flex h-8 items-start justify-center rounded-md px-4 text-sm font-medium transition-colors hover:bg-inherit focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            onClick={handleGoBack}
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Go Back
          </button>
          <article className="flex flex-col sm:flex-row items-center mb-6 space-y-4 sm:space-y-0 justify-between">
            <div className="flex items-center space-y-4 justify-between w-full">
              <div className="flex items-center space-x-4">
                <Link href={`/users/${post.author?.id}`} target="_blank">
                  <Avatar className="size-12">
                    <AvatarImage
                      src={avatarUrl}
                      alt={`${post.author?.firstName}'s avatar`}
                    />
                    <AvatarFallback>{post.author?.user}</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="text-center sm:text-left">
                  <p className="text-base font-medium text-black truncate">
                    {post.author?.user ?? 'Author'}
                  </p>
                  <p className="text-base text-gray-500 line-clamp-2 truncate">
                    {post.author?.role}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {post.author?.twitter && (
                  <Link
                    href={post.author.twitter}
                    target="_blank"
                    className="text-muted-foreground hover:text-foreground"
                    data-link-type="Twitter"
                    onClick={handleSocialLinkClick}
                  >
                    <FaTwitter className="size-6 text-black mr-10" />
                    <span className="sr-only">Twitter</span>
                  </Link>
                )}
                {post.author?.linkedin && (
                  <Link
                    href={post.author.linkedin}
                    target="_blank"
                    className="text-muted-foreground hover:text-foreground"
                    data-link-type="LinkedIn"
                    onClick={handleSocialLinkClick}
                  >
                    <FaLinkedin className="size-6 text-black mr-10" />
                    <span className="sr-only">LinkedIn</span>
                  </Link>
                )}
                {post.author?.facebook && (
                  <Link
                    href={post.author.facebook}
                    target="_blank"
                    className="text-muted-foreground hover:text-foreground"
                    data-link-type="Facebook"
                    onClick={handleSocialLinkClick}
                  >
                    <FaFacebook className="size-6 text-black mr-10" />
                    <span className="sr-only">Facebook</span>
                  </Link>
                )}
                {post.author?.instagram && (
                  <Link
                    href={post.author.instagram}
                    target="_blank"
                    className="text-muted-foreground hover:text-foreground"
                    data-link-type="Instagram"
                    onClick={handleSocialLinkClick}
                  >
                    <FaInstagram className="size-6 text-black mr-10" />
                    <span className="sr-only">Instagram</span>
                  </Link>
                )}
                {post.author?.medium && (
                  <Link
                    href={post.author.medium}
                    target="_blank"
                    className="text-muted-foreground hover:text-foreground"
                    data-link-type="Medium"
                    onClick={handleSocialLinkClick}
                  >
                    <FaMedium className="size-6 text-black mr-10" />
                    <span className="sr-only">Medium</span>
                  </Link>
                )}
                {post.author?.stackernews && (
                  <Link
                    href={post.author.stackernews}
                    target="_blank"
                    className="text-muted-foreground hover:text-foreground"
                    data-link-type="Medium"
                    onClick={handleSocialLinkClick}
                  >
                    <FaMedium className="size-6 text-black mr-10" />
                    <span className="sr-only">Medium</span>
                  </Link>
                )}
              </div>
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
          </article>
          <p className="text-gray-500 mt-4">
            {formatDate(post.createdAt)} •{' '}
            {calculateReadingTime(post.description)} min read
          </p>
          <section className="prose prose-slate">
            <h1 className="text-4xl font-bold text-center mt-6 flex-wrap break-words">
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
              <div className="bg-white p-6 rounded-lg shadow-md overflow-hidden">
                <div className="truncate break-words">
                  {parseHtmlContent(post.description, post)}
                </div>
              </div>
            </div>
          </section>
          {post.category && (
            <div className="mt-8 w-fit">
              <span className="flex items-center px-2 py-1 bg-[#000916] text-white rounded-full">
                <img
                  src="/category-white.png"
                  className="w-4 h-4 mr-2"
                  alt="Category Icon"
                />
                {post.category ? post.category.name : 'Uncategorized'}
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
                    <FaTags className="mr-2" />
                    {formatTags([tag]) ? tag.name : 'Uncategorized'}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex flex-col sm:flex-row items-start mt-8 space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex flex-row gap-4">
              <button
                className="w-fit flex items-center space-x-1"
                onClick={handleFavoriteClick}
              >
                {showBookmarkMessage && (
                  <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm bg-green-500 text-white rounded p-2 animate-fade-in-out">
                    Item bookmarked successfully!
                  </div>
                )}
                <FaBookmark
                  className={`size-5 ${
                    isSaved ? 'text-[#007BFF]' : 'text-gray-500'
                  }`}
                />
              </button>
              <div className="w-fit flex items-center space-x-1 text-gray-500">
                <FaComment className="size-5" />
              </div>
              <div className="w-fit flex items-center space-x-1 text-gray-500">
                <button onClick={handleShare}>
                  <FaShare className="size-5" />
                </button>
              </div>
            </div>
          </div>
          <div className="w-fit justify-start mt-2">
            {showShareBar && (
              <ShareBar postUrl={window.location.href} title={post.title} />
            )}
            {/*TODO agregar boton de reportar que cambie el boolean a true */}
            {}
          </div>
          <div className="flex w-full justify-center">
            <div className="mt-20 w-[30rem] justify-center bg-[#000916]/20 h-[0.1rem]"></div>
          </div>
          <section className="mt-8">
            {comments.map((comment) => {
              const author = comment.author || {
                firstName: 'Unknown',
                lastName: 'User',
                avatar: 'default-avatar.webp',
              };

              const avatarUrl = author.avatar?.startsWith('/')
                ? `${API_URL}${author.avatar}`
                : author.avatar;

              const authorName = `${author.user} `;

              return (
                <article
                  key={comment.id}
                  className="border rounded-md p-4 my-4 bg-gray-100 flex flex-col"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Link
                        href={`/users/${comment.author?.id}`}
                        target="_blank"
                      >
                        <Avatar className="size-10">
                          <AvatarImage src={avatarUrl} alt="Author avatar" />
                          <AvatarFallback>{author.user}</AvatarFallback>
                        </Avatar>
                      </Link>
                      <div>
                        <p className="text-base font-normal truncate">
                          {authorName}
                        </p>
                        <p className="text-base text-gray-500 font-light truncate">
                          {author.role}
                        </p>
                        <div className="text-sm text-gray-500">
                          {formatDate(comment.createdAt)}
                        </div>
                      </div>
                    </div>
                    {author?.id === comment.author.id && (
                      <button
                        onClick={() =>
                          handleDeleteComment(comment.id, comment.author.id)
                        }
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                  <p className="mt-2 text-base truncate">{comment.content}</p>
                </article>
              );
            })}
          </section>
          <form onSubmit={handleCommentSubmit} className="mt-4">
            <p className="text-gray-500 flex justify-end">
              {commentContent.length}/800
            </p>
            <textarea
              className="w-full border rounded-md p-2 resize-none"
              placeholder="Add a comment"
              rows={5}
              value={commentContent}
              maxLength={300}
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
      </main>
      <footer>
        <Footer setShowLoginModal={setShowLoginCard} />
      </footer>
      {showLoginCard && (
        <div className="w-screen fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white p-8 rounded-lg shadow-lg">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <img
                src="/close-circle-svgrepo-com.png"
                alt="Remove"
                className="size-7 cursor-pointer hover:animate-pulse"
              />
            </button>
            <LoginCard onClose={handleCloseModal} />
          </div>
        </div>
      )}
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
