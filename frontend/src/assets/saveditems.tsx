"use client";
import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsUpDown } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import DOMPurify from "dompurify";
import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL_DEV;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  padding: 1rem;
  background-color: inherit;
`;

type FavoriteItem = {
  id: number;
  imageUrlBase64: string | null;
  title: string;
  author: string;
  description: string;
  comments: { id: number; content: string }[];
  createdAt: Date;
};

const SavedItems: React.FC<{ userId: number }> = ({ userId }) => {
  const [favorites, setFavorites] = useState<
    {
      id: number;
      imageUrlBase64: string | null;
      title: string;
      author: string;
      description: string;
      comments: { id: number; content: string }[];
      createdAt: Date;
    }[]
  >([]);
  const [liked, setLiked] = useState<boolean[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [order, setOrder] = useState<string>("Date (newest first)");

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await axios.get(`${API_URL}/users/${userId}/favorites`);
        const favoritesData = res.data.map((favorite: any) => ({
          ...favorite,
          imageUrlBase64: favorite.imageUrl
            ? `data:image/jpeg;base64,${Buffer.from(
                favorite.imageUrl.data
              ).toString("base64")}`
            : null,
          createdAt: new Date(favorite.createdAt),
        }));
        setFavorites(favoritesData);
        setLiked(favoritesData.map(() => true));
      } catch (error) {
        console.error("Error fetching favorites", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [userId]);

  const toggleLike = async (index: number) => {
    const favorite = favorites[index];
    const newLiked = [...liked];
    newLiked[index] = !newLiked[index];

    try {
      if (!newLiked[index]) {
        await axios.delete(
          `${API_URL}/users/${userId}/favorites/${favorite.id}`
        );

        const updatedFavorites = favorites.filter((_, i) => i !== index);
        const updatedLiked = liked.filter((_, i) => i !== index);

        setFavorites(updatedFavorites);
        setLiked(updatedLiked);
      }
    } catch (error) {
      console.error("Error toggling favorite", error);
    }
  };

  const handleOrderChange = (newOrder: string) => {
    setOrder(newOrder);
    setFavorites(sortFavorites(favorites, newOrder));
  };

  const sortFavorites = (favorites: FavoriteItem[], order: string) => {
    switch (order) {
      case "Date (newest first)":
        return favorites.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );
      case "Date (oldest first)":
        return favorites.sort(
          (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
        );
      case "Title":
        return favorites.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return favorites;
    }
  };

  if (favorites.length === 0) {
    return (
      <div className="flex justify-center items-center h-full flex-col">
        <h2 className="text-black text-lg font-bold">
          You have not saved any articles yet
        </h2>
        <Image
          src="/Logo-blogchain.png"
          width={300}
          height={300}
          alt="Blogchain Logo"
          className="animate-bounce"
        />
      </div>
    );
  }

  return (
    <section className="flex items-center justify-between py-4">
      <div className="container px-4 md:px-6">
        <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter text-gray-800 mb-4">
          Your favorite items
        </h2>
        <div className="flex items-center justify-end mb-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-inherit border-border border-black rounded-lg"
              >
                <FontAwesomeIcon icon={faArrowsUpDown} className="h-4 w-4" />
                Order
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-lg shadow-lg">
              <DropdownMenuLabel>Order by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={order === "Date (newest first)"}
                onCheckedChange={() => handleOrderChange("Date (newest first)")}
                className="rounded-lg"
              >
                Date (newest first)
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={order === "Date (oldest first)"}
                onCheckedChange={() => handleOrderChange("Date (oldest first)")}
                className="rounded-lg"
              >
                Date (oldest first)
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={order === "Title"}
                onCheckedChange={() => handleOrderChange("Title")}
                className="rounded-lg"
              >
                Title
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-4">
          {loading ? (
            <Container>
              <Image
                src="/Logo-blogchain.png"
                width={300}
                height={300}
                alt="Blogchain Logo"
                className="animate-bounce"
              />
            </Container>
          ) : (
            favorites.map((favorite, index) => (
              <div
                key={index}
                className="group relative transition-all duration-300 ease-out hover:translate-x-1 hover:translate-y-1 hover:scale-105 hover:shadow-lg border-t border-b border-r-0 border-l-0 flex flex-col sm:flex-row items-center justify-between p-3 sm:p-4 md:p-6 bg-inherit shadow-md rounded-lg mb-4 overflow-hidden"
                style={{
                  transformStyle: "preserve-3d",
                  perspective: "1000px",
                }}
              >
                {favorite.imageUrlBase64 ? (
                  <img
                    src={favorite.imageUrlBase64}
                    alt={favorite.title || "Placeholder"}
                    className="h-32 w-full sm:w-32 sm:h-32 md:w-40 md:h-40 object-cover rounded-lg border border-gray-300 mb-3 sm:mb-0 sm:mr-4"
                  />
                ) : (
                  <div className="h-32 w-full sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-lg border border-gray-300 mb-3 sm:mb-0 sm:mr-4 bg-gray-200"></div>
                )}
                <div className="flex-grow flex flex-col items-start mb-3 sm:mb-0 sm:mr-4">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                    {favorite.title || "Untitled"}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 sm:line-clamp-3">
                    {favorite.description ? (
                      <span
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(favorite.description),
                        }}
                      />
                    ) : (
                      "No description available."
                    )}
                  </p>
                </div>
                <div className="flex flex-row sm:flex-col items-center justify-between w-full sm:w-auto">
                  <button
                    onClick={() => toggleLike(index)}
                    className="p-2 focus:outline-none transition-transform transform hover:scale-110 active:scale-95 sm:mb-4"
                    aria-label={liked[index] ? "Unsave item" : "Save item"}
                  >
                    <svg
                      width="1.5rem"
                      height="1.5rem"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0" />

                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />

                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          d="M19 19.2674V7.84496C19 5.64147 17.4253 3.74489 15.2391 3.31522C13.1006 2.89493 10.8994 2.89493 8.76089 3.31522C6.57467 3.74489 5 5.64147 5 7.84496V19.2674C5 20.6038 6.46752 21.4355 7.63416 20.7604L10.8211 18.9159C11.5492 18.4945 12.4508 18.4945 13.1789 18.9159L16.3658 20.7604C17.5325 21.4355 19 20.6038 19 19.2674Z"
                          stroke={liked[index] ? "#007BFF" : "#6b7280"}
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />{" "}
                      </g>
                    </svg>
                  </button>
                  <Button className="rounded-full bg-[#000916] hover:bg-[#000916]/80 text-sm">
                    <Link href={`/posts/${favorite.id}`}>Read More</Link>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default SavedItems;
