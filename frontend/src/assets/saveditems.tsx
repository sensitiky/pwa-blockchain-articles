"use client";
import React, { useState, useEffect } from "react";
import { BookMarkedIcon } from "lucide-react";
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
import { CircularProgress } from "@mui/material";
import styled from "styled-components";

const API_URL = process.env.NEXT_PUBLIC_API_URL_DEV;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 1rem;
  background-color: inherit;
`;

const SavedItems: React.FC<{ userId: number }> = ({ userId }) => {
  const [favorites, setFavorites] = useState<
    {
      imageUrlBase64: string | null;
      title: string;
      author: string;
      description: string;
    }[]
  >([]);
  const [liked, setLiked] = useState<boolean[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
        }));
        setFavorites(favoritesData);
        setLiked(favoritesData.map(() => false));
      } catch (error) {
        console.error("Error fetching favorites", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [userId]);

  const toggleLike = (index: number) => {
    const newLiked = [...liked];
    newLiked[index] = !newLiked[index];
    setLiked(newLiked);
  };

  return (
    <section className="max-h-dvh w-full py-6 md:py-12 lg:py-16">
      <div className="container px-4 md:px-6">
        <h2 className="text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-800 mb-4">
          Your favorite items
        </h2>
        <div className="flex items-center justify-end gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 rounded-lg bg-inherit border-border border-black shadow-md"
              >
                <FontAwesomeIcon icon={faArrowsUpDown} className="h-4 w-4" />
                Order
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Order by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>
                Date (newest first)
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>
                Date (oldest first)
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Title</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-4">
          {loading ? (
            <Container>
              <CircularProgress />
            </Container>
          ) : (
            favorites.map((favorite, index) => (
              <div
                key={index}
                className="card border-t-[1px] border-b-[1px] border-r-0 border-l-0 flex flex-col md:flex-row items-center justify-between p-4 sm:p-6 bg-inherit shadow-md rounded-lg mb-4"
              >
                {favorite.imageUrlBase64 ? (
                  <img
                    src={favorite.imageUrlBase64}
                    alt={favorite.title || "Placeholder"}
                    className="m-5 h-40 w-full md:w-auto md:h-44 rounded-lg border border-gray-300 mr-4"
                  />
                ) : (
                  <div className="m-5 h-40 w-full md:w-auto md:h-44 rounded-lg border border-gray-300 mr-4 bg-gray-200"></div>
                )}
                <div className="flex flex-col items-start mb-4 md:mb-0">
                  <h3 className="text-lg font-bold text-gray-900">
                    {favorite.title || "Untitled"}
                  </h3>
                  <p className="text-gray-600 line-clamp-3">
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
                <div className="flex items-center">
                  <button
                    onClick={() => toggleLike(index)}
                    className="ml-2 p-2 focus:outline-none transition-transform transform hover:scale-110 active:scale-95"
                    aria-label={liked[index] ? "Unsave item" : "Save item"}
                  >
                    <BookMarkedIcon
                      className={`h-5 w-5 transition-colors duration-300 ${
                        liked[index] ? "text-yellow-500" : "text-gray-500"
                      }`}
                    />
                  </button>
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
