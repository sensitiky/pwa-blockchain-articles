import React from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface Article {
  author: string;
  avatar: string;
  title: string;
  time: string;
}

const articles: Article[] = [
  {
    author: 'Sue Bui',
    avatar: '/path/to/avatar1.jpg',
    title: 'How Can Luna Classic Make You Rich?',
    time: '1 hour ago'
  },
  {
    author: 'Christian Lauer',
    avatar: '/path/to/avatar2.jpg',
    title: 'Salary of a Chief Data Engineer',
    time: '1 hour ago'
  },
  {
    author: 'Quant Galore',
    avatar: '/path/to/avatar3.jpg',
    title: 'I Figured Out How to Predict the Stock Market – and Still Lost Money.',
    time: '1 hour ago'
  },
  {
    author: 'Brawler Bearz',
    avatar: '/path/to/avatar4.jpg',
    title: 'Dev Blog #1',
    time: '1 hour ago'
  },
];

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
};

const ArticleCarousel = () => {
  return (
    <div className="py-16 px-4 md:px-8 mb-40">
      <h2 className="text-3xl font-bold text-center text-customColor-innovatio3 mb-8">
        Last Articles Published
      </h2>
      <Slider {...settings}>
        {articles.map((article, index) => (
          <div key={index} className="p-4">
            <div className="bg-white p-4 rounded-md shadow-md">
              <div className="flex items-center mb-4">
                <Image
                  src={article.avatar}
                  alt={article.author}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="ml-4">
                  <p className="font-semibold">{article.author}</p>
                  <p className="text-gray-500">{article.time}</p>
                </div>
              </div>
              <h3 className="text-lg font-bold">{article.title}</h3>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ArticleCarousel;
