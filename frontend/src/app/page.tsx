"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookie from "universal-cookie";
import Header from "@/assets/header";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";
import ArticleCarousel from "@/assets/carousel";
import LoginCard from "@/assets/login";
import Footer from "@/assets/footer";

const API_URL = process.env.NEXT_PUBLIC_API_URL_LOCAL;
const cookies = new Cookie();
type image = {
  url: string;
  alt: string;
};

type Avatar = {
  avatar: image;
};
const HomePage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [avatar, setAvatar] = useState<Avatar | null>(null);
  const [showLoginCard, setShowLoginCard] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = cookies.get("token");
    if (token) {
      fetchUserSession(token);
    }

    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }, []);
  const articles2 = [
    {
      author: "Nevermind",
      title: "Why Blockchain is Hard",
      date: "Jan 17, 2021",
      avatar: "/shadcn.jpg",
      image: "/reunion.png",
      description:
        "The hype around blockchain is massive. To hear the blockchain hype train tell it, blockchain will now: Solve income inequality, Make all data secure forever, Make everything much more efficient and trustless, Save dying.",
    },
    {
      author: "Kai Stinchcombe",
      title:
        "Blockchain is not only crappy technology but a bad vision for the future",
      date: "Oct 31, 2017",
      avatar: "/shadcn.jpg",
      image: "/badge.png",
      description:
        "Blockchain is not only crappy technology but a bad vision for the future. Its failure to achieve adoption to date is because systems built on trust, norm...",
    },
    {
      author: "Jimmy Song",
      title: "Learn Blockchains by Building One",
      date: "Dec 12, 2019",
      avatar: "/shadcn.jpg",
      image: "/profit.png",
      description:
        "The fastest way to learn how Blockchains work is to build one &ndash; You&apos;re here because, like me, you&apos;re psyched about the rise of Cryptocurrencies. And you want to know how Blockchains work &ndash; the fundamental ...",
    },
    {
      author: "Emmie Chang",
      title: "We already know blockchains killer apps",
      date: "Mar 28, 2019",
      avatar: "/shadcn.jpg",
      image: "/Saly-1.png",
      description:
        "It wasn&apos;t too long ago that Silicon Valley scoffed at cryptocurrencies. All over coffee shops in Mountain View and Menlo Park, you heard the same conversation: &quot;Sure, it&apos;s cool technology, but when are we going...",
    },
  ];
  const fetchUserSession = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/users/session`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        console.error("Failed to fetch user session");
      }
    } catch (error) {
      console.error("Error fetching user session:", error);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    cookies.remove("token");
  };

  const handleLoginSignUpClick = () => {
    setShowLoginCard(true);
  };

  const handleCloseModal = () => {
    setShowLoginCard(false);
  };

  return (
    <div className="min-w-screen">
      <Header />

      <div className="relative h-screen flex items-center justify-center bg-customColor-header">
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-white to-transparent z-0"></div>
        <div
          className="relative z-10"
          data-aos="fade-in"
          data-aos-once="true"
          data-aos-anchor-placement="top-bottom"
          data-aos-offset="200"
        >
          <h1 className="text-center text-yellow-400 text-2xl sm:text-3xl md:text-4xl">
            Welcome to Blogchain
          </h1>
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-center text-white font-bold mt-4">
            A place where we write <br />
            articles about blockchain
            <br />
            to discuss
          </h2>
          <div className="text-center mt-8 flex justify-center">
            <Image
              src="/Hero.png"
              alt="Hero Image"
              height={1000}
              width={1000}
              className="w-full max-w-sm sm:max-w-md md:max-w-lg"
            />
          </div>
        </div>
      </div>

      <section className="flex bg-gradientbg2 py-4 px-4 md:px-8">
        <div
          className="container mx-auto text-center"
          data-aos="fade-in"
          data-aos-once="true"
          data-aos-anchor-placement="top-bottom"
          data-aos-offset="200"
        >
          <div className="grid gap-8 mb-24 sm:grid-cols-2">
            <div className="text-center flex flex-col justify-center">
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-semibold mb-4 text-customColor-innovatio3">
                Read, write, share and discuss blockchain
              </h1>
            </div>
            <div className="text-left">
              <p className="text-base sm:text-lg md:text-lg mb-12 text-customColor-innovatio3">
                Blogchain is an educational space to connect web3 content
                writers and readers interested in blockchain technology and its
                adoption. We are looking to fill with educational, journalistic
                and informative articles about this broad subject, submit your
                articles, meet your new "influencers" and stay tuned to the
                latest news in this world, welcome to blogchain.
              </p>
            </div>
          </div>
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-3">
            <div>
              <h2 className="text-right text-2xl sm:text-3xl md:text-4xl text-customColor-letras">
                Blogchainer Redactor
              </h2>
              <p className="text-right mt-4 text-base sm:text-lg md:text-lg text-customColor-innovatio3">
                Are you a writer of educational, academic, informative, review,
                tutorial content and want to expand your readership? Write or
                import your articles in our blog, make yourself known and flood
                your readers with knowledge.
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
              <h2 className="text-2xl sm:text-3xl md:text-4xl text-customColor-letras">
                Web3 Lector
              </h2>
              <p className="mt-4 text-base sm:text-lg md:text-lg text-customColor-innovatio3">
                Are you a reader enthusiastic about blockchain technology and
                Web3 applications? Soak up the knowledge of many content
                creators, follow your influencers and stay tuned for all the
                updates in this space.
              </p>
            </div>
          </div>
        </div>
      </section>

      <ArticleCarousel />

      <section className="bg-gradientbg2 py-16 px-4 md:px-8">
        <div
          className="container mx-auto"
          data-aos="fade-in"
          data-aos-once="true"
          data-aos-anchor-placement="top-bottom"
          data-aos-offset="200"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-customColor-innovatio3 mb-14">
              Discover Articles
            </h2>
          </div>
          <div className="flex flex-wrap justify-between mb-8">
            <div className="flex flex-col w-full sm:w-auto mb-4 md:mb-0">
              <select className="py-2 border-b-2 border-t-2 border-l-0 bg-inherit border-r-0 focus:ring-0 border-customColor-innovatio3 focus:border-customColor-innovatio3 text-base sm:text-lg">
                <option>Category</option>
              </select>
            </div>
            <div className="flex flex-col w-full sm:w-auto mb-4 md:mb-0">
              <select className="py-2 border-b-2 border-t-2 bg-inherit border-l-0 border-r-0 focus:ring-0 border-customColor-innovatio3 focus:border-customColor-innovatio3 text-base sm:text-lg">
                <option>Labels most used</option>
              </select>
            </div>
            <div className="flex flex-col w-full sm:w-auto mb-4 md:mb-0">
              <select className="py-2 border-b-2 border-t-2 bg-inherit border-l-0 border-r-0 border-customColor-innovatio3 focus:ring-0 focus:border-customColor-innovatio3 text-base sm:text-lg">
                <option>Date</option>
              </select>
            </div>
          </div>
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2">
            {articles2.map((article, index) => (
              <div
                key={index}
                className="flex flex-col border-b border-customColor-innovatio3 pb-4 mb-4"
              >
                <div className="flex items-start mb-4">
                  <Image
                    src={article.avatar}
                    alt={article.author}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                  <div className="ml-4">
                    <p className="text-lg font-semibold">{article.author}</p>
                    <p className="text-sm text-gray-500">{article.date}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  <Image
                    src={article.image}
                    alt={article.title}
                    width={100}
                    height={100}
                    className="rounded-md"
                  />
                  <div className="ml-4">
                    <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                    <p className="text-gray-600">{article.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/articles">
              <Button className="px-6 py-2 border-2 text-black bg-inherit border-black hover:bg-customColor-innovatio3 hover:text-customColor-innovatio rounded-full">
                View All
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <Footer />

      {showLoginCard && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white p-8 rounded-lg shadow-lg">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            <LoginCard onClose={handleCloseModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
