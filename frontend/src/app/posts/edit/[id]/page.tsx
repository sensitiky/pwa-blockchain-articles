"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../../../../context/authContext";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Header from "@/assets/header";
import Footer from "@/assets/footer";
import { ArrowLeftIcon } from "lucide-react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import RichTextEditor from "@/components/ui/texteditor";
import { EditPostDto } from "@/interfaces/interfaces";
import LoginCard from "@/assets/login";
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 1rem;
  background-color: inherit;
`;

const EditPostPage = () => {
  const { user } = useAuth();
  const [post, setPost] = useState<EditPostDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showLoginCard, setShowLoginCard] = useState(false);
  const { id } = useParams();
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL_DEV;

  const fetchPost = async (id: string) => {
    try {
      const response = await axios.get(`${API_URL}/posts/${id}`);
      const postData = response.data;
      setPost({
        title: postData.title,
        content: postData.content,
        description: postData.description,
        imageUrl: postData.imageUrl ? postData.imageUrl : null,
        imagePreviewUrl: postData.imageUrl ? postData.imageUrl : null,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching post data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPost(id as string);
    }
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setPost((prevPost) => {
      if (!prevPost) return null;
      return {
        ...prevPost,
        [name]: value,
      };
    });
  };

  const handleEditorChange = (value: string) => {
    setPost((prevPost) => {
      if (!prevPost) return null;
      return {
        ...prevPost,
        description: value,
      };
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imagePreviewUrl = URL.createObjectURL(file);
      setPost((prevPost) => {
        if (!prevPost) return null;
        return {
          ...prevPost,
          imageUrl: file,
          imagePreviewUrl,
        };
      });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.error("User is not logged in");
      alert("You need to be authenticated to edit the post");
      return;
    }

    if (!post?.title || !post?.description || !post?.imageUrl) {
      setShowPopup(true);
      return;
    }

    const formData = new FormData();
    if (title.length > 140) {
      alert("Title exceeds the maximum length of 140 characters.");
      return;
    }

    if (/[^a-zA-Z0-9\s?!¡¿&\/\\´']/.test(title)) {
      alert("Title contains disallowed special characters.");
      return;
    }
    formData.append("title", post.title);
    formData.append("content", post.content);
    formData.append("description", post.description);
    if (post.imageUrl instanceof File) {
      formData.append("image", post.imageUrl);
    }

    try {
      await axios.patch(`${API_URL}/posts/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Post updated successfully!");
      router.push(`/posts/${id}`);
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Error updating post");
    }
  };
  const handleCloseModal = () => {
    setShowLoginCard(false);
  };
  if (loading) {
    return (
      <div>
        <Container>
          <Image
            src="/BLOGCHAIN.png"
            width={200}
            height={200}
            alt="Blogchain Logo"
            className="animate-bounce"
          />
        </Container>
      </div>
    );
  }

  if (!post) {
    return <div>Error loading post data</div>;
  }

  return (
    <div className="bg-white">
      <Header />
      <div className="container mx-auto p-8">
        <div className="flex flex-col items-center">
          <form
            onSubmit={handleFormSubmit}
            className="space-y-4 w-full max-w-3xl shadow-2xl bg-gray-300 rounded-lg"
          >
            <div className="flex justify-start ml-4 mt-2 w-full">
              <button
                type="button"
                className="flex hover:underline bg-inherit text-black h-8 items-center justify-start rounded-md text-sm font-medium transition-colors hover:bg-inherit focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                onClick={() => router.back()}
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Go Back
              </button>
            </div>
            <div className="flex flex-col items-center">
              <h1 className="text-2xl font-bold">Edit Post</h1>
            </div>

            <div className="m-4 p-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Title
              </label>
              <Input
                type="text"
                name="title"
                value={post.title}
                onChange={handleInputChange}
                required
                maxLength={140}
                className="rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <p className="text-right text-gray-500 text-sm mt-1 mr-10">
              {post.title.length}/140
            </p>
            <div className="m-4 p-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-[#000916] file:text-white hover:file:bg-[#000916]/80"
              />
            </div>
            <div></div>
            {post.imagePreviewUrl && (
              <div className="m-6 rounded-lg overflow-hidden">
                <Image
                  src={post.imagePreviewUrl}
                  alt="Banner"
                  width={1920}
                  height={1080}
                  className="w-full h-[15rem] mb-4 object-contain"
                />
              </div>
            )}
            <div className="m-4 p-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Description
              </label>
              <RichTextEditor
                onChange={handleEditorChange}
                value={post.description}
              />
            </div>
            <div className="w-full justify-end flex">
              <Button
                type="submit"
                className="p-10 mr-4 mb-4 bg-[#000916] text-white px-4 py-2 rounded-full shadow-md hover:bg-[#000916]/80"
              >
                Update Post
              </Button>
            </div>
          </form>
        </div>
        <div>
          <AnimatePresence>
            {showPopup && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center bg-transparent bg-opacity-75 z-50"
              >
                <div className="backdrop-blur bg-white border border-black p-6 rounded-lg shadow-lg text-center">
                  <h2 className="text-2xl mb-4 text-black">
                    Complete all fields
                  </h2>
                  <Button onClick={() => setShowPopup(false)}>Close</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
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

export default EditPostPage;
