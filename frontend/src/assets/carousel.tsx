import React from "react";
import Slider from "react-slick";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaRegComment, FaRegHeart } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import Link from "next/link";

interface Article {
  author: string;
  avatar: string;
  title: string;
  description: string;
  time: string;
  comments: number;
  tags: string[];
  reads: number;
  image: string;
  likes: number;
}

const articles: Article[] = [
  {
    author: "Sue Bui",
    avatar: "/shadcn.jpg",
    title: "How Can Luna Classic Make You Rich?",
    time: "1 hour ago",
    comments: 12,
    description: "Este es un texto de ejemplo",
    tags: [],
    reads: 230,
    image: "/reunion.png",
    likes: 10,
  },
  {
    author: "Christian Lauer",
    avatar: "/shadcn.jpg",
    title: "Salary of a Chief Data Engineer",
    time: "1 hour ago",
    comments: 12,
    description: "Este es un texto de ejemplo",
    tags: [],
    reads: 230,
    image: "/reunion.png",
    likes: 10,
  },
  {
    author: "Quant Galore",
    avatar: "/shadcn.jpg",
    title:
      "I Figured Out How to Predict the Stock Market – and Still Lost Money.",
    time: "1 hour ago",
    comments: 12,
    description: "Este es un texto de ejemplo",
    tags: [],
    reads: 230,
    image: "/reunion.png",
    likes: 10,
  },
  {
    author: "Brawler Bearz",
    avatar: "/shadcn.jpg",
    title: "Dev Blog #1",
    time: "1 hour ago",
    comments: 12,
    description: "Este es un texto de ejemplo",
    tags: [],
    reads: 230,
    image: "/reunion.png",
    likes: 10,
  },
];

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 1500,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const ArticleCarousel = () => {
  return (
    <div className="bg-gradientbg py-16 px-4 md:px-8">
      <div
        data-aos="fade-in"
        data-aos-once="true"
        data-aos-anchor-placement="top-bottom"
        data-aos-offset="200"
      >
        <h2 className="text-3xl font-bold text-center text-customColor-innovatio3 mb-8">
          Last Articles Published
        </h2>
        <Slider {...settings}>
          {articles.map((article, index) => (
            <div key={index} className="p-4 flex justify-center">
              <div
                className="bg-opacity-50 backdrop-blur-3xl bg-white p-6 rounded-xl flex flex-col justify-between border-[1px] border-black"
                style={{ width: "100%", maxWidth: "560px", height: "100%" }}
              >
                <div className="flex items-start overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    width={100}
                    height={100}
                    className="rounded-lg object-cover"
                  />
                  <div className="ml-4 flex-1">
                    <h2 className="text-xl font-semibold">{article.title}</h2>
                    <p className="text-sm text-gray-900">
                      {article.description}
                    </p>
                    <div className="flex items-center mt-2">
                      <span className="text-sm text-gray-700">
                        {article.author}
                      </span>
                      <span className="text-sm text-gray-700 ml-2">
                        {article.time}
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
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-500">
                    {article.reads} reads
                  </span>
                  <Link href="/draft">
                    <button className="bg-customColor-innovatio3 text-white px-4 py-2 rounded-full hover:bg-customColor-innovatio hover:text-customColor-innovatio3">
                      Read More
                    </button>
                  </Link>
                </div>
                <div className="flex items-center justify-start mt-4 space-x-4">
                  <span className="text-gray-500">10 min read</span>
                  <span className="bg-gray-500 w-px h-6"></span>
                  <button className="flex items-center space-x-1 text-gray-500">
                    <FaRegComment className="w-5 h-5" />
                    <span>{article.comments}</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-500">
                    <FaRegHeart className="w-5 h-5" />
                    <span>{article.likes}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default ArticleCarousel;
