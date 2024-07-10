//Landing page WIP
"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookie from "universal-cookie";
import Header from "@/assets/header";
import Image from "next/image";
import ProjectCard from "@/assets/draft";
import Footer from "@/assets/footer";
import Info from "@/assets/card";

const cookies = new Cookie();

const HomePage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = cookies.get("token");
    if (token) {
      fetchUserSession(token);
    }
  }, []);

  const fetchUserSession = async (token: string) => {
    try {
      const response = await fetch("http://localhost:4000/users/session", {
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

  const users = [
    { name: "Tom Cooper", reads: 7260, avatar: "/shadcn.jpg" },
    { name: "Tim Denning", reads: 6920, avatar: "/shadcn.jpg" },
    { name: "Blake Lemoine", reads: 6700, avatar: "/shadcn.jpg" },
    { name: "Artur Hayes", reads: 6145, avatar: "/shadcn.jpg" },
    { name: "Frank Andrade", reads: 5267, avatar: "/shadcn.jpg" },
    { name: "Frank Andrade", reads: 5267, avatar: "/shadcn.jpg" },
    { name: "Frank Andrade", reads: 5267, avatar: "/shadcn.jpg" },
    { name: "Frank Andrade", reads: 5267, avatar: "/shadcn.jpg" },
  ];

  const articles = [
    {
      author: "Daisy Kirui",
      title: "Is Web5, Web6 and Web7, a near future?",
      time: "9 Hours Ago",
      avatar: "/shadcn.jpg",
    },
    {
      author: "Nevermind",
      title:
        "The new platform for the new internet: The trusted way to realize Web3 raises €3M",
      time: "9 Hours Ago",
      avatar: "/shadcn.jpg",
    },
    {
      author: "Unique Network",
      title:
        "App Promotion Staking: A Uniquely Accessible Pathway for Developers",
      time: "9 Hours Ago",
      avatar: "/shadcn.jpg",
    },
    {
      author: "Wire",
      title: "Gamestop Launches New NFT Marketplace Integrated with Wyre",
      time: "9 Hours Ago",
      avatar: "/shadcn.jpg",
    },
  ];

  const categories = [
    { name: "Educational", count: 1120 },
    { name: "Tutorial", count: 965 },
    { name: "Reviews", count: 33 },
    { name: "Case Study", count: 567 },
    { name: "Experience", count: 439 },
    { name: "Journalistic Interviews", count: 439 },
  ];

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

  return (
    <div className="bg-gradient3">
      <Header />
      <div className="relative h-screen flex items-center justify-center">
        <div className="absolute top-0 left-0 w-full h-full opacity-75"></div>
        <div className="relative z-10 text-center text-white p-8">
          <h1 className="text-yellow-400 text-xl md:text-2xl">
            Welcome to Blogchain
          </h1>
          <h2 className="text-3xl md:text-5xl font-bold mt-4">
            A place where we write <br />
            articles about blockchain
            <br />to discuss
          </h2>
          <div className="mt-8 flex justify-center">
            <Image
              src="/Hero.png"
              alt="Hero Image"
              height={500}
              width={500}
              className="w-full max-w-xs md:max-w-md"
            />
          </div>
        </div>
      </div>

      <section className="py-16 px-4 md:px-8 mb-52">
        <div className="container mx-auto text-center">
          <div className="grid md:grid-cols-2 gap-8 mb-48">
            <div className="md:col-span-1 text-left flex flex-col justify-center">
              <h1 className="text-3xl md:text-5xl font-semibold mb-4 text-customColor-innovatio3">
                Read, write, share, and discuss blockchain
              </h1>
              <div className="flex justify-start items-center mb-6">
                <p className="text-xl mr-2 text-customColor-innovatio3">
                  Powered by
                </p>
                <Image
                  src="/Medium.png"
                  alt="medium"
                  width={150}
                  height={150}
                />
              </div>
            </div>
            <div className="md:col-span-1 text-left">
              <p className="text-xl mb-12 text-customColor-innovatio3">
                Blogchain is an educational space to connect web3 content
                writers and readers interested in blockchain technology and its
                adoption. We are looking to fill with educational, journalistic
                and informative articles about this broad subject, submit your
                articles, meet your new "influencers" and stay tuned to the
                latest news in this world, welcome to blogchain.
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-left mt-20">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-customColor-letras">
                Blogchain Redactor
              </h2>
              <p className="mt-4 text-lg text-customColor-innovatio3">
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
                height={500}
                width={500}
                className="w-full max-w-xs md:max-w-md"
              />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-customColor-letras">
                Web3 Lector
              </h2>
              <p className="mt-4 text-lg text-customColor-innovatio3">
                Are you a reader enthusiastic about blockchain technology and
                Web3 applications? Soak up the knowledge of many content
                creators, follow your influencers and stay tuned for all the
                updates in this space.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 md:px-8">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-6">
            <div className="col-span-1">
              <h2 className="text-2xl md:text-2xl font-bold mb-4 text-customColor-innovatio3">
                Users with Most Contributions
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <ul>
                  {users
                    .slice(0, Math.ceil(users.length / 2))
                    .map((user, index) => (
                      <li key={index} className="flex items-center mb-2">
                        <Image
                          src={user.avatar}
                          alt={user.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div className="ml-2">
                          <p className="text-lg font-semibold">{user.name}</p>
                          <p className="text-sm text-gray-500">
                            {user.reads} reads
                          </p>
                        </div>
                      </li>
                    ))}
                </ul>
                <ul>
                  {users
                    .slice(Math.ceil(users.length / 2))
                    .map((user, index) => (
                      <li key={index} className="flex items-center mb-2">
                        <Image
                          src={user.avatar}
                          alt={user.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div className="ml-2">
                          <p className="text-lg font-semibold">{user.name}</p>
                          <p className="text-sm text-gray-500">
                            {user.reads} reads
                          </p>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
              <div className="text-center">
                <Button className="mt-4 px-4 py-2 border-2 rounded-full bg-inherit text-customColor-innovatio3 border-customColor-innovatio3 hover:bg-customColor-innovatio3 hover:text-customColor-innovatio">
                  View All
                </Button>
              </div>
            </div>
            <div className="w-0 border-r-2 border-customColor-innovatio3"></div>
            <div className="col-span-1">
              <h2 className="text-2xl md:text-2xl font-bold mb-4 text-customColor-innovatio3">
                Most Liked Articles
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <ul>
                  {articles
                    .slice(0, Math.ceil(articles.length / 2))
                    .map((article, index) => (
                      <li key={index} className="flex items-center mb-2">
                        <Image
                          src={article.avatar}
                          alt={article.author}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div className="ml-2">
                          <p className="text-lg font-semibold">
                            {article.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {article.time}
                          </p>
                        </div>
                      </li>
                    ))}
                </ul>
                <ul>
                  {articles
                    .slice(Math.ceil(articles.length / 2))
                    .map((article, index) => (
                      <li key={index} className="flex items-center mb-2">
                        <Image
                          src={article.avatar}
                          alt={article.author}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div className="ml-2">
                          <p className="text-lg font-semibold">
                            {article.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {article.time}
                          </p>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
              <div className="text-center">
                <Button className="mt-4 px-4 py-2 border-2 rounded-full bg-inherit text-customColor-innovatio3 border-customColor-innovatio3 hover:bg-customColor-innovatio3 hover:text-customColor-innovatio">
                  View All
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t my-8 border-customColor-innovatio3"></div>
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4 text-customColor-innovatio3">
              Categories
            </h2>
            <div className="flex flex-wrap">
              {categories.map((category, index) => (
                <div key={index} className="mr-4 mb-4">
                  <Button className="px-4 py-2 border-2 rounded-full bg-inherit border-customColor-innovatio3 text-customColor-innovatio3 hover:bg-customColor-innovatio3 hover:text-customColor-innovatio">
                    {category.name}{" "}
                    <span className="ml-2 text-gray-500">{category.count}</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 md:px-8 mb-40">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-customColor-innovatio3">
              Discover Articles
            </h2>
          </div>
          <div className="flex flex-wrap justify-between mb-8">
            <div className="flex flex-col w-full md:w-auto mb-4 md:mb-0">
              <select className="border-b-2 border-t-2 border-l-0 bg-inherit border-r-0 focus:ring-0 border-customColor-innovatio3 focus:border-customColor-innovatio3 text-lg">
                <option>Category</option>
              </select>
            </div>
            <div className="flex flex-col w-full md:w-auto mb-4 md:mb-0">
              <select className="border-b-2 border-t-2 bg-inherit border-l-0 border-r-0 focus:ring-0 border-customColor-innovatio3 focus:border-customColor-innovatio3 text-lg">
                <option>Labels most used</option>
              </select>
            </div>
            <div className="flex flex-col w-full md:w-auto mb-4 md:mb-0">
              <select className="border-b-2 border-t-2 bg-inherit border-l-0 border-r-0 border-customColor-innovatio3 focus:ring-0 focus:border-customColor-innovatio3 text-lg">
                <option>Date</option>
              </select>
            </div>
            <Button className="px-4 py-2 border-2 bg-inherit border-customColor-innovatio3 text-customColor-innovatio3 rounded-full hover:bg-customColor-innovatio3 hover:text-customColor-innovatio">
              View All
            </Button>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
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
            <Button className="px-6 py-2 border-2 text-customColor-innovatio3 bg-inherit border-customColor-innovatio3 hover:bg-customColor-innovatio3 hover:text-customColor-innovatio rounded-full">
              View More
            </Button>
          </div>
        </div>
      </section>

      <footer className="py-6 border-t border-gray-300 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Image
              src="/Logo.svg"
              alt="Innovatio logo"
              width={200}
              height={24}
              className=" mb-4"
            />
            <p className="text-gray-400 text-sm">
              Help different crowdfunding <br />
              campaigns become a reality
              <br />
              thanks to your contributions,
              <br /> invest in projects,
              <br /> fund purposes and get rewards.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-950 text-lg mb-4">
              How it works
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:underline text-gray-400">
                  Campaign Flow
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline text-gray-400">
                  Investment Flow
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline text-gray-400">
                  Milestones & Control
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline text-gray-400">
                  Q & A
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-950 text-lg mb-4">
              About us
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:underline text-gray-400">
                  Introduction
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline text-gray-400">
                  Team & Members
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline text-gray-400">
                  Discord Community
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline text-gray-400">
                  Social Media
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-950 text-lg mb-4">
              Help with the Campaigns
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:underline text-gray-400">
                  Ideas of Campaign
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline text-gray-400">
                  Tokenomics
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline text-gray-400">
                  Digital Marketing Strategy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline text-gray-400">
                  Contact our team
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 flex justify-center space-x-6">
          <Link href="#" className="text-gray-500 hover:text-gray-900">
            <Image src="/discord.svg" alt="discord" width={24} height={24} />
          </Link>
          <Link href="#" className="text-gray-500 hover:text-gray-900">
            <Image src="/twitter.svg" alt="twitter" width={24} height={24} />
          </Link>
          <Link href="#" className="text-gray-500 hover:text-gray-900">
            <Image
              src="/instagram.svg"
              alt="instagram"
              width={24}
              height={24}
            />
          </Link>
          <Link href="#" className="text-gray-500 hover:text-gray-900">
            <Image src="/facebook.svg" alt="facebook" width={24} height={24} />
          </Link>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-4 flex justify-center text-gray-400 text-sm">
          <p>&copy; 2024 Innovatio. All rights reserved.</p>
        </div>
      </div>
    </footer>
    </div>
  );
};

export default HomePage;
