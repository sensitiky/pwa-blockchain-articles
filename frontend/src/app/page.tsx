'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookie from 'universal-cookie';
import Header from '@/assets/header';
import Image from 'next/image';
import AOS from 'aos';
import 'aos/dist/aos.css';
import ArticleCarousel from '@/assets/carousel';
import LoginCard from '@/assets/login';
import Footer from '@/assets/footer';
import axios from 'axios';
import parse from 'html-react-parser';
import { Tag, Category, Post } from '@/interfaces/interfaces';

const API_URL = process.env.NEXT_PUBLIC_API_URL_DEV;
const cookies = new Cookie();

const POSTS_PER_PAGE = 6;

const HomePage: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ username: string; id: number } | null>(
    null
  );
  const [showLoginCard, setShowLoginCard] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryCounts, setCategoryCounts] = useState<
    { categoryId: number; count: number }[]
  >([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = cookies.get('token');
    if (token) {
      fetchUserSession(token);
    }

    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
    });

    fetchTags();
    fetchCategories();
    fetchCategoryCounts();
    fetchPosts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [selectedTagId, selectedCategoryId]);

  const fetchTags = async () => {
    try {
      const response = await axios.get(`${API_URL}/tags`);
      setTags(response.data);
    } catch (error) {
      console.error('Error fetching tags', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories', error);
    }
  };

  const fetchCategoryCounts = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/posts/count-by-category`);
      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = response.data;
      setCategoryCounts(result);
    } catch (error) {
      console.error('Error fetching category counts:', error);
    }
  }, []);

  const fetchPosts = async () => {
    try {
      const url = selectedTagId
        ? `${API_URL}/posts/by-tag?limit=${POSTS_PER_PAGE}&tagId=${selectedTagId}`
        : selectedCategoryId
        ? `${API_URL}/posts/by-category?limit=${POSTS_PER_PAGE}&categoryId=${selectedCategoryId}`
        : `${API_URL}/posts?limit=${POSTS_PER_PAGE}`;
      const response = await axios.get(url);
      const postsData = response.data.data;
      setPosts(postsData || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  const fetchUserSession = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/users/session`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        console.error('Failed to fetch user session');
      }
    } catch (error) {
      console.error('Error fetching user session:', error);
    }
  };

  const handleCloseModal = () => {
    setShowLoginCard(false);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleCategoryClick = (categoryId: number) => {
    const newCategoryId = selectedCategoryId === categoryId ? null : categoryId;
    setSelectedCategoryId(newCategoryId);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <div className="h-full">
      <Header />
      <div className="py-16 relative h-fit flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 flex justify-center items-center bottom-[15rem] bg-[#000916] overflow-hidden">
          <Image
            src="/bg-about.gif"
            alt="Light Effect"
            width={2000}
            height={1200}
            unoptimized
            priority
            style={{ opacity: 0.25 }}
          />
        </div>
        <div
          className="relative px-4 sm:px-6 md:px-8"
          data-aos="fade-in"
          data-aos-once="true"
          data-aos-anchor-placement="top-bottom"
          data-aos-offset="200"
        >
          <h1 className="text-center text-[#FFC017] text-2xl">
            Welcome to <span className="font-bold">Blogchain</span>
          </h1>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center text-white font-bold mt-4">
            A place to write <br />
            articles about blockchain
            <br />
            for discussion
          </h2>
          <div className="text-center flex justify-center lg:mt-[-50px] mb-[6rem]">
            <Image
              src="/Hero.png"
              alt="Hero Image"
              height={1000}
              width={1000}
              priority
              className="w-full max-w-xl"
            />
          </div>
        </div>
      </div>

      <section className="flex flex-col py-4 px-4 md:px-8">
        <div
          className="container mx-auto text-center"
          data-aos="fade-in"
          data-aos-once="true"
          data-aos-anchor-placement="top-bottom"
          data-aos-offset="200"
        >
          <div className="grid gap-8 mb-24 sm:grid-cols-1 md:grid-cols-2">
            <div className="text-center flex flex-col justify-center">
              <h1 className="text-2xl sm:text-3xl md:text-5xl  mb-4 text-[#263238] font-normal">
                Read, write, share and discuss blockchain
              </h1>
            </div>
            <div className="text-left">
              <p className="sm:text-lg md:text-xl mb-12 text-[#263238]">
                Blogchain is an educational space to connect web content and
                readers interested in blockchain technology and its adoption. We
                seek to fill with educational, journalistic and informative
                articles on this broad topic. Meet your new “influencers” and
                keep up to date with the latest news in this world, welcome to
                blogchain.
              </p>
            </div>
          </div>
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-3">
            <div>
              <h2 className="text-right text-2xl sm:text-3xl md:text-4xl text-[#FFC017] font-normal">
                Blogchainer Redactor
              </h2>
              <p className="text-right mt-4 text-base sm:text-lg md:text-lg text-[#263238]">
                Are you a writer of educational, academic, informational,
                review, tutorial content and want to expand your readership?
                Write or import your articles in our blog, make yourself known
                and flood your readers with knowledge.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <Image
                src="/Drafthero.png"
                alt="DraftHero"
                height={1000}
                width={1000}
                className="w-full max-w-sm sm:max-w-md md:max-w-lg"
              />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl text-[#FFC017] font-normal">
                Web3 Lector
              </h2>
              <p className="mt-4 text-base sm:text-lg md:text-lg text-[#263238]">
                Are you an avid reader of blockchain technology and Web3
                applications? Soak up the knowledge of many content creators,
                follow your influencers and stay tuned to all the news in this
                space.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto p-8 mt-10">
        <div className="flex items-center justify-start">
          <img src="eye.svg" className="m-2" />
          <h2 className="text-lg font-semibold text-[#263238]">CATEGORIES</h2>
          <div className="border-t w-full ml-4 border-[#263238]"></div>
        </div>
        <div className="flex flex-row flex-wrap justify-center">
          {categories.map((category) => {
            const categoryCount = categoryCounts.find(
              (count) => count.categoryId === category.id
            );
            return (
              <div
                className="text-center mb-8 flex items-center"
                key={category.id}
              >
                <div className="text-base p-2 font-normal text-[#263238] bg-white rounded-full border border-[#263238] mx-2 hover:bg-inherit flex items-center">
                  {category.name}
                  <span className="ml-2 text-muted-foreground rounded-full p-1 bg-slate-300">
                    {categoryCount ? categoryCount.count : 0}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="border-t w-full ml-4 border-[#263238]"></div>
      </section>

      <ArticleCarousel />

      <section className="py-16 px-4 md:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-8 justify-center flex">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal text-[#263238] mb-14">
              Discover Articles
            </h2>
          </div>

          <div className="custom-dropdown-container mb-8" ref={dropdownRef}>
            <div
              className="custom-dropdown bg-inherit rounded-none shadow-none p-4"
              onClick={toggleDropdown}
            >
              <div className="selected-option text-gray-700">
                {selectedCategoryId
                  ? categories.find(
                      (category) => category.id === selectedCategoryId
                    )?.name
                  : 'Category'}
              </div>
              {isDropdownOpen && (
                <div className="custom-options mt-2 bg-inherit rounded-none shadow-none">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="custom-option p-2 hover:bg-gray-100"
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      {category.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2">
            {posts.map((post, index) => (
              <div
                key={index}
                className="flex flex-col border-b border-[#263238] pb-4 mb-4 rounded-none shadow-none bg-inherit"
              >
                <div className="flex flex-col sm:flex-row mb-4">
                  {post.imageUrlBase64 && (
                    <img
                      src={post.imageUrlBase64}
                      width={1920}
                      height={1080}
                      alt={post.title}
                      className="rounded-md w-full sm:w-1/3 h-auto"
                    />
                  )}
                  <div className="ml-0 sm:ml-4 mt-4 sm:mt-0 flex-1">
                    <div className="flex items-start mb-4">
                      {post.author?.avatar && (
                        <Link
                          href={`/users/${post.author?.id}`}
                          target="_blank"
                        >
                          <img
                            src={
                              post.author?.avatar
                                ? post.author.avatar.startsWith('http')
                                  ? post.author.avatar
                                  : `${API_URL}${post.author.avatar}`
                                : '/default-avatar.webp'
                            }
                            alt="Author image"
                            className="w-10 h-10 rounded-full"
                          />
                        </Link>
                      )}
                      <div className="ml-4">
                        <p className="text-lg font-semibold text-[#263238]">
                          {post.author?.user}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(post.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div>
                      <Link href={`/posts/${post.id}`}>
                        <h3 className="text-xl font-bold mb-2 text-[#263238]">
                          {post.title}
                        </h3>
                      </Link>
                      {!post.imageUrlBase64 &&
                        typeof post.description === 'string' &&
                        !post.description.includes('<iframe') && (
                          <p className="text-sm sm:text-base text-muted-foreground mb-4 line-clamp-3">
                            {typeof post.description === 'string'
                              ? parse(post.description.replace(/<img.*?>/g, ''))
                              : JSON.stringify(post.description)}
                          </p>
                        )}
                    </div>
                  </div>
                </div>
                <div className="flex-grow"></div>{' '}
                <div className="flex justify-end relative">
                  <Link href={`/posts/${post.id}`}>
                    <Button className="text-base rounded-full">
                      Read More
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/articles">
              <Button className="px-6 py-2 text-white bg-[#000916] hover:bg-[#000916]/80 rounded-full font-normal text-base">
                View All
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer setShowLoginModal={setShowLoginCard} />
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
    </div>
  );
};

export default HomePage;
