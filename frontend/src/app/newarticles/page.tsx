"use client";
import { useEffect, useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import Footer from "@/assets/footer";
import Header from "@/assets/header";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import dynamic from "next/dynamic";
import { FaUpload } from "react-icons/fa";
import { useAuth } from "../../../context/authContext";
import { motion, AnimatePresence } from "framer-motion";

interface Category {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

const CustomEditor = dynamic(() => import("@/components/ui/editor"), {
  ssr: false,
});

const categoryDescriptions: { [key: number]: string } = {
  1: "In-depth analysis of Web3 projects, trends and technologies. Get expert opinions, critical reviews and thought-provoking perspectives.",
  2: "Step-by-step guides and instructions to help you navigate the Web3 world. Learn how to use tools, platforms, and protocols, and acquire new skills.",
  3: "Evaluations of Web3 products, services, and platforms. Get the information you need to make informed decisions about your investments and interactions.",
  4: "Real-world examples of Web3 applications across various industries. Learn how blockchain, cryptocurrencies, and NFTs are transforming businesses and solving problems.",
  5: "Stay up-to-date with the latest developments in the Web3 space. Get breaking news, project updates, regulatory changes, and market trends.",
  6: "Discover essential tools, platforms, and educational resources for navigating the Web3 ecosystem.",
  7: "Exclusive conversations with Web3 leaders, innovators, and influencers. Gain unique insights into their journeys, visions, and the future of the decentralized web.",
};

export default function NewArticles() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [newTag, setNewTag] = useState<string>("");
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL_PROD;

  useEffect(() => {
    const fetchCategoriesAndTags = async () => {
      try {
        const [categoriesResponse, tagsResponse] = await Promise.all([
          axios.get(`${API_URL}/categories`),
          axios.get(`${API_URL}/tags`),
        ]);
        setCategories(categoriesResponse.data);
        setTags(tagsResponse.data);
      } catch (error) {
        console.error("Error fetching categories and tags", error);
      }
    };
    fetchCategoriesAndTags();
  }, []);

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
  };

  const handleCategoryRemove = () => {
    setSelectedCategory(null);
  };

  const handleTagSelect = (tag: Tag) => {
    setSelectedTags((prevTags) => {
      if (prevTags.some((t) => t.id === tag.id)) {
        return prevTags.filter((t) => t.id !== tag.id);
      } else if (prevTags.length < 5) {
        return [...prevTags, tag];
      } else {
        alert("You can select up to 5 tags.");
        return prevTags;
      }
    });
  };

  const handleAddNewTag = () => {
    if (newTag.trim() !== "" && selectedTags.length < 5) {
      const newTagObject = { id: tags.length + 1, name: newTag };
      setTags((prevTags) => [...prevTags, newTagObject]);
      setSelectedTags((prevTags) => [...prevTags, newTagObject]);
      setNewTag("");
    }
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (publish: boolean) => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }
    if (!selectedCategory || selectedTags.length < 2) {
      setShowPopup(true);
      return;
    }

    if (!description) {
      console.error("Description is empty");
      return;
    }

    const tags = selectedTags.map((tag) => ({ id: tag.id, name: tag.name }));
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("authorId", user.id.toString());
    formData.append("publish", JSON.stringify(publish));
    formData.append("categoryId", selectedCategory.id.toString());
    formData.append("tags", JSON.stringify(tags));
    if (imageFile) {
      formData.append("image", imageFile);
    }
    formData.append("created_at", new Date().toISOString());
    try {
      const response = await axios.post(`${API_URL}/posts`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      router.push("/articles");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="max-h-screen bg-gray-100">
      <Header />
      <div className="bg-gray-100 flex flex-col min-h-screen">
        <main className="flex-1 py-8 px-4 md:px-6 justify-center flex">
          <div className="w-full max-w-6xl flex flex-col md:flex-row relative">
            <div className="w-full md:w-1/4 pr-4 mb-4 md:mb-0">
              <div className="mb-6">
                <div className="text-black font-semibold text-xl mb-2">
                  Category
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {!selectedCategory &&
                    categories.map((category) => (
                      <motion.button
                        key={category.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`text-lg hover:bg-inherit rounded-full border-gray-500 w-fit ${
                          selectedCategory === category ? "bg-gray-300" : ""
                        }`}
                        onClick={() => handleCategorySelect(category)}
                      >
                        {category.name}
                      </motion.button>
                    ))}
                </div>
                <AnimatePresence>
                  {selectedCategory && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 0, transition: { duration: 0 } }}
                      className="bg-gray-100 mt-4"
                    >
                      <div className="flex justify-between">
                        <h2 className="text-xl font-semibold text-gray-800">
                          {selectedCategory.name}
                        </h2>
                        <button
                          className="text-red-500 hover:text-red-700 text-xl"
                          onClick={handleCategoryRemove}
                        >
                          x
                        </button>
                      </div>
                      <p className="text-gray-600 mt-2">
                        {categoryDescriptions[selectedCategory.id]}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div>
                <div className="text-black font-semibold text-xl mb-2">
                  Tags
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {/* Mostrar los primeros 5 tags del backend */}
                  {tags.slice(0, 5).map((tag) => (
                    <motion.button
                      key={tag.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`text-lg hover:bg-inherit rounded-full border-gray-500 w-fit ${
                        selectedTags.some((t) => t.id === tag.id)
                          ? "bg-gray-300"
                          : ""
                      }`}
                      onClick={() => handleTagSelect(tag)}
                    >
                      {tag.name}
                    </motion.button>
                  ))}
                  {/* Mostrar los tags seleccionados */}
                  {selectedTags.map((tag) => (
                    <motion.button
                      key={tag.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`text-lg hover:bg-inherit rounded-full border-gray-500 w-fit ${
                        selectedTags.some((t) => t.id === tag.id)
                          ? "bg-gray-300"
                          : ""
                      }`}
                      onClick={() => handleTagSelect(tag)}
                    >
                      {tag.name}
                    </motion.button>
                  ))}
                </div>
                <Input
                  placeholder="Add new tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="w-full mt-2"
                />
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={handleAddNewTag}
                >
                  Add Tag
                </Button>
              </div>
              <div className="mt-4 text-gray-600 text-sm">
                Must select 1 category and 2 to 5 tags.
              </div>
            </div>
            <div className="w-full md:w-3/4 pl-0 md:pl-4">
              <motion.div
                className={`p-6 bg-white text-black rounded-lg shadow-lg ${
                  !selectedCategory || selectedTags.length < 2
                    ? "bg-gray-300"
                    : "bg-gray-300"
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                onClick={() => {
                  if (!selectedCategory || selectedTags.length < 2) {
                    setShowPopup(true);
                  }
                }}
              >
                <div className="flex justify-end items-center">
                  <div className="space-x-4">
                    <motion.button
                      onClick={() => handleSubmit(true)}
                      className="text-white bg-green-600 px-4 py-2 rounded-full hover:bg-green-500 transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={!selectedCategory || selectedTags.length < 2}
                    >
                      Publish
                    </motion.button>
                  </div>
                </div>
                <div className="mt-6">
                  <h1 className="text-2xl font-bold text-center">
                    Create an Article
                  </h1>
                  <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full mt-4 p-2 bg-white rounded-full border border-gray-400 text-black placeholder:text-gray-700"
                    maxLength={300}
                    disabled={!selectedCategory || selectedTags.length < 2}
                  />
                  <p className="text-right text-gray-500 text-sm mt-1">
                    {title.length}/300
                  </p>
                  <div className="mt-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Upload Image
                    </label>
                    <div className="relative">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt="Banner"
                          className="w-full h-52 object-cover rounded-lg mb-4"
                        />
                      ) : (
                        <div className="w-full h-52 flex items-center justify-center border-2 border-dashed border-gray-400 rounded-lg mb-4">
                          <FaUpload className="h-10 w-10 text-gray-400" />
                        </div>
                      )}
                      <input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleImageUpload}
                        disabled={!selectedCategory || selectedTags.length < 2}
                      />
                    </div>
                    <span className="text-center flex justify-center text-gray-500">
                      The image will appear in full resolution in the article.
                    </span>
                  </div>
                  <div className="mt-4">
                    <CustomEditor
                      onChange={setDescription}
                      disabled={!selectedCategory || selectedTags.length < 2}
                    />
                  </div>
                </div>
              </motion.div>
            </div>
            {/* Popup */}
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
                    <h2 className="text-2xl font-bold mb-4 text-red-600">
                      Select 1 category and 2 tags first
                    </h2>
                    <Button onClick={() => setShowPopup(false)}>Close</Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
