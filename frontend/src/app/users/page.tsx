//Seccion de usuarios

import Header from "@/assets/header";
import React from "react";
import Image from "next/image";
const articles = [
  {
    id: 1,
    title: "Why Blockchain is Hard",
    author: "Nevermind",
    tags: ["Decentralization", "#blockchain", "#Tech"],
    readTime: "10 min read",
    comments: 5,
    stars: 4.2,
    likes: 11,
    reads: 45,
    image: "/test.jpg", // Actualiza con la ruta correcta de la imagen del artículo
  },
  // Puedes agregar más artículos aquí
];

export default function Test1() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-2">
      <Header />
      <div className="flex flex-col md:flex-row justify-between">
        <div className="w-full md:w-1/3 lg:w-1/4 p-4 border-r-2 border-customColor-innovatio3 min-h-screen">
          <div className="text-center">
            <Image
              src="/shadcn.jpg"
              alt="User Image"
              width={150}
              height={150}
              className="rounded-full mx-auto"
            />
            <h2 className="text-2xl font-semibold mt-4">Nevermind</h2>
            <p className="text-customColor-innovatio mt-2">520 Followers</p>
            <button className="mt-2 px-4 py-2 border-2 rounded-full text-customColor-innovatio3 border-customColor-innovatio3 hover:bg-customColor-innovatio3 hover:text-white">
              Follow
            </button>
            <p className="mt-4 text-customColor-innovatio3  ">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div className="flex justify-center space-x-4 mt-4 text-gray-500">
              <a href="#">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="w-full md:w-2/3 lg:w-3/4 p-4">
          <h3 className="text-2xl font-semibold mb-4">Articles</h3>
          {articles.map((article) => (
            <div key={article.id} className="mb-8 border-b border-customColor-innovatio3 pb-4">
              <div className="flex flex-col md:flex-row">
                <Image
                  src={article.image}
                  alt={article.title}
                  width={200}
                  height={200}
                  className="rounded-md mb-4 md:mb-0 md:mr-4"
                />
                <div className="flex flex-col justify-between">
                  <div>
                    <div className="flex items-center mb-2">
                      <Image
                        src="/shadcn.jpg"
                        alt={article.author}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div className="ml-2">
                        <p className="text-lg font-semibold">
                          {article.author}
                        </p>
                        <div className="flex space-x-2">
                          {article.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="text-sm text-customColor-innovatio3 border px-2 py-1 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <h4 className="text-xl font-bold mb-2">{article.title}</h4>
                    <p className="text-gray-700">{article.readTime}</p>
                  </div>
                  <div className="flex items-center mt-4 text-gray-500">
                    <span className="flex items-center mr-4">
                      <i className="far fa-comment-alt mr-1"></i>
                      {article.comments}
                    </span>
                    <span className="flex items-center mr-4">
                      <i className="far fa-star mr-1"></i>
                      {article.stars}
                    </span>
                    <span className="flex items-center mr-4">
                      <i className="far fa-thumbs-up mr-1"></i>
                      {article.likes}
                    </span>
                    <span className="flex items-center">
                      <i className="far fa-eye mr-1"></i>
                      {article.reads}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
