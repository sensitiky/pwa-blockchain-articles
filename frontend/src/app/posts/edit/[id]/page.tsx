"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../../../../context/authContext";
import { Input } from "@/components/ui/input";
import CustomEditor from "@/components/ui/editor";
import Image from "next/image";
import Header from "@/assets/header";
import Footer from "@/assets/footer";

interface EditPostDto {
  title: string;
  content: string;
  description: string;
  imageUrl: string | null | File;
  imagePreviewUrl?: string | null;
}

const EditPostPage = () => {
  const { user } = useAuth();
  const [post, setPost] = useState<EditPostDto | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL_PROD;
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

    const formData = new FormData();
    formData.append("title", post?.title || "");
    formData.append("content", post?.content || "");
    formData.append("description", post?.description || "");
    if (post && post.imageUrl instanceof File) {
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return <div>Error loading post data.</div>;
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto p-8 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">Edit Post</h1>
        <form
          onSubmit={handleFormSubmit}
          className="space-y-4 w-full max-w-2xl"
        >
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Title
            </label>
            <Input
              type="text"
              name="title"
              value={post.title}
              onChange={handleInputChange}
              required
              className="rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          {post.imagePreviewUrl && (
            <div className="mt-6 rounded-lg overflow-hidden w-full">
              <Image
                src={post.imagePreviewUrl}
                alt="Banner"
                width={1920}
                height={600}
                className="w-full object-cover"
              />
            </div>
          )}
          <div className="mt-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description
            </label>
            <CustomEditor onChange={handleEditorChange} />
          </div>
          <Button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 w-full"
          >
            Update Post
          </Button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default EditPostPage;
