"use client";
import { useState } from "react";
import Image from "next/image";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { FaRegHeart, FaRegComment } from "react-icons/fa";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Footer2 from "@/assets/footer2";
import Header2 from "@/assets/header2";

interface Article {
  id: number;
  title: string;
  description: string;
  author: string;
  date: string;
  tags: string[];
  image: string;
  reads: number;
}

const articles: Article[] = [
  {
    author: "Nevermind",
    title: "Why Blockchain is Hard",
    date: "Jan 17, 2021",
    image: "/reunion.png",
    reads: 230,
    description:
      "The hype around blockchain is massive. To hear the blockchain hype train tell it, blockchain will now: Solve income inequality, Make all data secure forever, Make everything much more efficient and trustless, Save dying.",
    id: 0,
    tags: [],
  },
  {
    author: "Nevermind",
    title: "Why Blockchain is Hard",
    date: "Jan 17, 2021",
    image: "/reunion.png",
    reads: 230,
    description:
      "The hype around blockchain is massive. To hear the blockchain hype train tell it, blockchain will now: Solve income inequality, Make all data secure forever, Make everything much more efficient and trustless, Save dying.",
    id: 0,
    tags: [],
  },
  {
    author: "Nevermind",
    title: "Why Blockchain is Hard",
    date: "Jan 17, 2021",
    image: "/reunion.png",
    reads: 230,
    description:
      "The hype around blockchain is massive. To hear the blockchain hype train tell it, blockchain will now: Solve income inequality, Make all data secure forever, Make everything much more efficient and trustless, Save dying.",
    id: 0,
    tags: [],
  },
  {
    author: "Nevermind",
    title: "Why Blockchain is Hard",
    date: "Jan 17, 2021",
    image: "/reunion.png",
    reads: 230,
    description:
      "The hype around blockchain is massive. To hear the blockchain hype train tell it, blockchain will now: Solve income inequality, Make all data secure forever, Make everything much more efficient and trustless, Save dying.",
    id: 0,
    tags: [],
  },
  {
    author: "Nevermind",
    title: "Why Blockchain is Hard",
    date: "Jan 17, 2021",
    image: "/reunion.png",
    reads: 230,
    description:
      "The hype around blockchain is massive. To hear the blockchain hype train tell it, blockchain will now: Solve income inequality, Make all data secure forever, Make everything much more efficient and trustless, Save dying.",
    id: 0,
    tags: [],
  },
  {
    author: "Nevermind",
    title: "Why Blockchain is Hard",
    date: "Jan 17, 2021",
    image: "/reunion.png",
    reads: 230,
    description:
      "The hype around blockchain is massive. To hear the blockchain hype train tell it, blockchain will now: Solve income inequality, Make all data secure forever, Make everything much more efficient and trustless, Save dying.",
    id: 0,
    tags: [],
  },
  {
    author: "Nevermind",
    title: "Why Blockchain is Hard",
    date: "Jan 17, 2021",
    image: "/reunion.png",
    reads: 230,
    description:
      "The hype around blockchain is massive. To hear the blockchain hype train tell it, blockchain will now: Solve income inequality, Make all data secure forever, Make everything much more efficient and trustless, Save dying.",
    id: 0,
    tags: [],
  },
  {
    author: "Nevermind",
    title: "Why Blockchain is Hard",
    date: "Jan 17, 2021",
    image: "/reunion.png",
    reads: 230,
    description:
      "The hype around blockchain is massive. To hear the blockchain hype train tell it, blockchain will now: Solve income inequality, Make all data secure forever, Make everything much more efficient and trustless, Save dying.",
    id: 0,
    tags: [],
  },
  {
    author: "Nevermind",
    title: "Why Blockchain is Hard",
    date: "Jan 17, 2021",
    image: "/reunion.png",
    reads: 230,
    description:
      "The hype around blockchain is massive. To hear the blockchain hype train tell it, blockchain will now: Solve income inequality, Make all data secure forever, Make everything much more efficient and trustless, Save dying.",
    id: 0,
    tags: [],
  },
  {
    author: "Nevermind",
    title: "Why Blockchain is Hard",
    date: "Jan 17, 2021",
    image: "/reunion.png",
    reads: 230,
    description:
      "The hype around blockchain is massive. To hear the blockchain hype train tell it, blockchain will now: Solve income inequality, Make all data secure forever, Make everything much more efficient and trustless, Save dying.",
    id: 0,
    tags: [],
  },
  {
    author: "Nevermind",
    title: "Why Blockchain is Hard",
    date: "Jan 17, 2021",
    image: "/reunion.png",
    reads: 230,
    description:
      "The hype around blockchain is massive. To hear the blockchain hype train tell it, blockchain will now: Solve income inequality, Make all data secure forever, Make everything much more efficient and trustless, Save dying.",
    id: 0,
    tags: [],
  },
  {
    author: "Nevermind",
    title: "Why Blockchain is Hard",
    date: "Jan 17, 2021",
    image: "/reunion.png",
    reads: 230,
    description:
      "The hype around blockchain is massive. To hear the blockchain hype train tell it, blockchain will now: Solve income inequality, Make all data secure forever, Make everything much more efficient and trustless, Save dying.",
    id: 0,
    tags: [],
  },
  {
    author: "Nevermind",
    title: "Why Blockchain is Hard",
    date: "Jan 17, 2021",
    image: "/reunion.png",
    reads: 230,
    description:
      "The hype around blockchain is massive. To hear the blockchain hype train tell it, blockchain will now: Solve income inequality, Make all data secure forever, Make everything much more efficient and trustless, Save dying.",
    id: 0,
    tags: [],
  },
  {
    author: "Nevermind",
    title: "Why Blockchain is Hard",
    date: "Jan 17, 2021",
    image: "/reunion.png",
    reads: 230,
    description:
      "The hype around blockchain is massive. To hear the blockchain hype train tell it, blockchain will now: Solve income inequality, Make all data secure forever, Make everything much more efficient and trustless, Save dying.",
    id: 0,
    tags: [],
  },
  {
    author: "Nevermind",
    title: "Why Blockchain is Hard",
    date: "Jan 17, 2021",
    image: "/reunion.png",
    reads: 230,
    description:
      "The hype around blockchain is massive. To hear the blockchain hype train tell it, blockchain will now: Solve income inequality, Make all data secure forever, Make everything much more efficient and trustless, Save dying.",
    id: 0,
    tags: [],
  },
];

const Articles: React.FC = () => {
  const [selectedbutton, setSelectedButton] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 5;
  const totalPages = Math.ceil(articles.length / articlesPerPage);
  const [postLikes, setPostLikes] = useState(0);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleButtonClick = (category: string) => {
    if (selectedbutton === category) {
      setSelectedButton(null);
    } else {
      setSelectedButton(category);
    }
  };


  const currentArticles = articles.slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage
  );

  return (
    <div className="bg-customColor-hueso md:bg-customColor-hueso px-4 min-w-fit">
      <Header2/>
        <h1 className="w-full bg-customColor-header text-4xl font-bold text-center mb-8 text-customColor-hueso">
          Articles
        </h1>
        <p className="bg-customColor-header text-center text-customColor-letras mb-4">
          Choose your favorite categories
        </p>
        <div className="flex flex-wrap justify-center mb-8 space-x-2">
          {[
            "Education (1120)",
            "Tutorial (963)",
            "Reviews (31)",
            "Case Study (567)",
            "Experience (439)",
            "Journalist Interview (49)",
          ].map((category) => (
            <button
              key={category}
              className={`border-2 px-4 py-1 rounded-full ${
                selectedbutton === category
                  ? "border-back text-white bg-black"
                  : "border-black text-black bg-inherit"
              }`}
              onClick={() => handleButtonClick(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-center mb-8 space-y-4 md:space-y-0 md:space-x-4">
          <select className="text-black border-b-2 border-t-2 border-l-0 bg-inherit border-r-0 focus:ring-inherit border-black hover:border-black text-lg px-2 py-2">
            <option>Order</option>
            <option className="bg-inherit">Most - Less Likes</option>
            <option>Most - Less Comments</option>
            <option>Most - Less Saved</option>
            <option>Most Recents</option>
          </select>
          <select className="text-black border-b-2 border-t-2 border-l-0 bg-inherit border-r-0 focus:ring-0 border-black hover:border-black text-lg px-2 py-2">
            <option>Read Time</option>
            <option>Less than 10 min</option>
            <option>More than 10 min</option>
            <option>Less than 20 min</option>
            <option>More than 20+ min</option>
          </select>
          <select className="text-black border-b-2 border-t-2 border-l-0 bg-inherit border-r-0 focus:ring-0 border-black hover:border-black text-lg px-2 py-2">
            <option>Users</option>
            <option>Most read users</option>
            <option>Most saved users</option>
            <option>User with most contribution</option>
            <option>All Users</option>
          </select>
          <select className="text-black border-b-2 border-t-2 border-l-0 bg-inherit border-r-0 focus:ring-0 border-black hover:border-black text-lg px-2 py-2">
            <option>Date</option>
            <option>Last 24 hours</option>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
            <option>Last 6 months</option>
          </select>
        </div>
        <div className="flex flex-wrap justify-center mb-8">
          <div className="grid grid-cols-1 gap-4 w-full md:w-3/4 lg:w-2/3">
            {currentArticles.map((article) => (
              <div
                key={article.id}
                className="bg-inherit p-6 border-b-2 border-t-2 filter border-black"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center">
                  <Image
                    src={article.image}
                    alt={article.title}
                    width={100}
                    height={100}
                    className="rounded-lg"
                  />
                  <div className="md:ml-4 mt-4 md:mt-0">
                    <h2 className="text-2xl font-semibold">{article.title}</h2>
                    <p className="text-sm text-gray-900 ">
                      {article.description}
                    </p>
                    <div className="flex items-center mt-2">
                      <span className="text-sm text-gray-700">
                        {article.author}
                      </span>
                      <span className="text-sm text-gray-700 ml-2">
                        {article.date}
                      </span>
                    </div>
                    <div className="flex mt-2 space-x-2">
                      {article.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4">
                  <span className="text-sm text-gray-500">
                    {article.reads} reads
                  </span>
                  <Link href="/draft">
                    <Button className="bg-customColor-innovatio3 text-white px-4 py-2 rounded-full hover:bg-customColor-innovatio hover:text-customColor-innovatio3 border-2 hover:border-customColor-innovatio3 mt-2 md:mt-0">
                      Read More
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center justify-start mt-4 space-x-4">
                  <span className="text-gray-500">10 min read</span>
                  <Separator
                    orientation="vertical"
                    className="bg-gray-500 w-px h-6"
                  />
                  <Button className="flex items-center space-x-1 -px-1 text-gray-500 hover:bg-inherit bg-inherit">
                    <FaRegComment className="w-5 h-5" />
                    <span>5</span>
                  </Button>
                  <Button className="flex items-center space-x-1 -px-1   text-gray-500 hover:bg-inherit bg-inherit">
                    <FaRegHeart className="w-5 h-5" />
                    <span>11</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => handlePageChange(currentPage - 1)}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            {currentPage < totalPages - 1 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() => handlePageChange(currentPage + 1)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      <Footer2/>
    </div>
  );
};

export default Articles;
