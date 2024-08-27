"use client";
import { useEffect, useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import Footer from "@/assets/footer";
import Header from "@/assets/header";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { FaUpload } from "react-icons/fa";
import { useAuth } from "../../../context/authContext";
import { motion, AnimatePresence } from "framer-motion";
import RichTextEditor from "@/components/ui/texteditor";

interface Category {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
}

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
  const [gifFile, setGifFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [newTag, setNewTag] = useState<string>("");
  const [showPopup, setShowPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL_DEV;

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
    if (
      newTag.trim() !== "" &&
      newTag.length <= 24 &&
      selectedTags.length < 5
    ) {
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
      alert("User not authenticated");
      return;
    }
    if (!selectedCategory || selectedTags.length < 2) {
      setShowPopup(true);
      return;
    }

    if (!description) {
      alert("Description is empty");
      return;
    }

    const tags = selectedTags.map((tag) => ({ id: tag.id, name: tag.name }));

    const formData = new FormData();
    if (title.length > 140) {
      alert("Title exceeds the maximum length of 140 characters.");
      return;
    }

    if (/[^a-zA-Z0-9\s?!¡¿&\/\\´']/.test(title)) {
      alert("Title contains disallowed special characters.");
      return;
    }

    formData.append("title", title);
    formData.append("description", description);
    formData.append("authorId", user.id.toString());
    formData.append("publish", JSON.stringify(publish));
    formData.append("categoryId", selectedCategory.id.toString());
    formData.append("tags", JSON.stringify(tags));
    if (imageFile) {
      formData.append("image", imageFile);
    }
    if (gifFile) {
      formData.append("gifFile", gifFile);
    }
    formData.append("created_at", new Date().toISOString());

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${API_URL}/posts`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      router.push("/articles");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
      } else {
        console.error("Error creating post:", error);
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-h-screen bg-gray-100">
      <Header />
      <div className="bg-gray-100 flex flex-col min-h-screen">
        <main className="flex-1 py-8 px-4 md:px-6 justify-center flex">
          <div className="w-full max-w-6xl flex flex-col md:flex-row relative">
            <div className="w-full md:w-1/3 pr-4 mb-4 md:mb-0">
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
                      className="bg-gray-100 mt-4 flex-col"
                    >
                      <div className="flex justify-between">
                        <h2 className="text-xl font-semibold text-gray-800">
                          {selectedCategory.name}
                        </h2>
                        <img
                          src="/close-circle-svgrepo-com.png"
                          alt="Remove"
                          onClick={handleCategoryRemove}
                          className="size-8 cursor-pointer hover:animate-pulse"
                        />
                      </div>
                      <p className="text-gray-600 mt-2">
                        {categoryDescriptions[selectedCategory.id]}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="mb-4 w-[8rem] bg-black h-[0.05rem]"></div>
              <div>
                <div className="text-black font-semibold text-xl mb-2">
                  Tags
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {/* Mostrar los primeros 5 tags del backend */}
                  {tags
                    .filter(
                      (taga) => !selectedTags.some((t) => t.id === taga.id)
                    )
                    .slice(0, 5)
                    .map((tag) => (
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
                      className={`text-lg hover:bg-gray-300 rounded-full border-gray-500 w-full ${
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
                  maxLength={24}
                />
                <p className="justify-end flex text-gray-500">
                  {newTag.length}/24
                </p>
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
            <div
              className={`w-full md:w-3/4 pl-0 md:pl-4 bg-white rounded-xl ${
                !selectedCategory || selectedTags.length < 2
                  ? "animate-pulse"
                  : ""
              }`}
            >
              {" "}
              <motion.div
                className={`p-6 text-black rounded-lg ${
                  !selectedCategory || selectedTags.length < 2 ? "" : ""
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
                {(!selectedCategory || selectedTags.length < 2) && (
                  <div className="flex justify-between items-center flex-col">
                    <span className="text-gray-400 text-xl justify-center items-center">
                      Select 1 category and 2 tags first
                    </span>
                  </div>
                )}
                <div className="flex justify-end items-center">
                  <div className="space-x-4">
                    <motion.button
                      onClick={() => {
                        if (!selectedCategory || selectedTags.length < 2) {
                          setShowPopup(true);
                        } else {
                          handleSubmit(true);
                        }
                      }}
                      className="text-white bg-green-600 px-4 py-2 rounded-full hover:bg-green-500 transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={isSubmitting}
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
                    className="w-full mt-4 p-2 bg-white rounded-lg border border-gray-400 text-black placeholder:text-gray-700"
                    maxLength={140}
                    disabled={!selectedCategory || selectedTags.length < 2}
                  />
                  <p className="text-right text-gray-500 text-sm mt-1">
                    {title.length}/140
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
                          className="w-full h-[20rem] object-contain rounded-lg mb-4"
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
                    <RichTextEditor
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
                  className="absolute top-0 left-0 right-0 flex justify-center bg-transparent bg-opacity-75 z-50"
                >
                  <div className="backdrop-blur bg-white border border-black p-6 rounded-lg shadow-lg text-center mt-4">
                    <h2 className="text-2xl mb-4 text-black">
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
