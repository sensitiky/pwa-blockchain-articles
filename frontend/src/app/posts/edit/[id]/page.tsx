"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../../../../context/authContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface EditPostDto {
  title: string;
  content: string;
  description: string;
  imageUrl: string | null;
}

const EditPostPage = () => {
  const { user } = useAuth();
  const [post, setPost] = useState<EditPostDto | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const router = useRouter();

  const fetchPost = async (id: string) => {
    try {
      const response = await axios.get(`https://blogchain.onrender.com/posts/${id}`);
      const postData = response.data;
      setPost({
        title: postData.title,
        content: postData.content,
        description: postData.description,
        imageUrl: postData.imageUrl || null,
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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.error("User is not logged in");
      alert("You need to be authenticated to edit the post");
      return;
    }
    try {
      await axios.patch(`https://blogchain.onrender.com/posts/${id}`, post);
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Post</h1>
      <form onSubmit={handleFormSubmit} className="space-y-4">
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
            className="rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Content
          </label>
          <Textarea
            name="content"
            value={post.content}
            onChange={handleInputChange}
            required
            className="rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Description
          </label>
          <Textarea
            name="description"
            value={post.description}
            onChange={handleInputChange}
            required
            className="rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Image URL
          </label>
          <Input
            type="text"
            name="imageUrl"
            value={post.imageUrl || ""}
            onChange={handleInputChange}
            className="rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <Button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Update Post
        </Button>
      </form>
    </div>
  );
};

export default EditPostPage;
