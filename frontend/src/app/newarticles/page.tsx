"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import Footer from "@/assets/footer";
import Header from "@/assets/header";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import dynamic from "next/dynamic";

type Category = {
  id: number;
  name: string;
};

type Tag = {
  id: number;
  name: string;
};

const CustomEditor = dynamic(() => import("@/components/ui/editor"), {
  ssr: false,
});

export default function NewArticles() {
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
  const router = useRouter();
  const user = { id: 1 };

  useEffect(() => {
    const fetchCategoriesAndTags = async () => {
      try {
        const [categoriesResponse, tagsResponse] = await Promise.all([
          axios.get("http://localhost:4000/categories"),
          axios.get("http://localhost:4000/tags"),
        ]);
        setCategories(categoriesResponse.data);
        const filteredTags = tagsResponse.data.filter(
          (tag: Tag) => tag.id <= 6
        );
        setTags(filteredTags);
      } catch (error) {
        console.error("Error fetching categories and tags", error);
      }
    };

    fetchCategoriesAndTags();
  }, []);

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
  };

  const handleTagSelect = (tag: Tag) => {
    setSelectedTags((prevTags) => {
      if (prevTags.includes(tag)) {
        return prevTags.filter((t) => t !== tag);
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

    if (!selectedCategory) {
      console.error("Category not selected");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("authorId", user.id.toString());
    formData.append("publish", JSON.stringify(publish));
    formData.append("categoryId", selectedCategory.id.toString());
    formData.append("tags", JSON.stringify(selectedTags));

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/posts",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Post created successfully:", response.data);

      router.push("/articles");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="max-h-screen">
      <Header />
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 py-8 px-4 md:px-6 flex justify-center">
          <div className="w-full max-w-6xl flex flex-col md:flex-row">
            <div className="w-full md:w-1/4 pr-4 mb-4 md:mb-0">
              <div className="mb-6">
                <div className="text-black font-semibold text-xl mb-2">
                  Category
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant="outline"
                      className={`text-lg hover:bg-inherit rounded-full border-gray-500 w-fit ${
                        selectedCategory === category ? "bg-gray-300" : ""
                      }`}
                      onClick={() => handleCategorySelect(category)}
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-black font-semibold text-xl mb-2">
                  Tags
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {tags.map((tag) => (
                    <Button
                      key={tag.id}
                      variant="outline"
                      className={`text-lg hover:bg-inherit rounded-full border-gray-500 w-fit ${
                        selectedTags.includes(tag) ? "bg-gray-300" : ""
                      }`}
                      onClick={() => handleTagSelect(tag)}
                    >
                      {tag.name}
                    </Button>
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
              <div
                className={`p-6 bg-inherit text-black rounded-lg ${
                  selectedCategory && selectedTags.length >= 2
                    ? ""
                    : "opacity-50 pointer-events-none"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="space-x-4">
                    <button
                      onClick={() => handleSubmit(false)}
                      className="text-white bg-gray-700 px-4 py-2 rounded-full hover:bg-gray-600"
                    >
                      Save Draft
                    </button>
                    <button
                      onClick={() => handleSubmit(true)}
                      className="text-white bg-green-600 px-4 py-2 rounded-full hover:bg-green-500"
                    >
                      Publish
                    </button>
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
                    className="w-full mt-4 p-2 bg-inherit rounded-full border border-gray-400 text-black placeholder:text-gray-700"
                    maxLength={300}
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
                          <UploadIcon className="h-10 w-10 text-gray-400" />
                        </div>
                      )}
                      <input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleImageUpload}
                      />
                    </div>
                    <span className="text-center flex justify-center text-gray-500">
                      The image will appear in full resolution in the article.
                    </span>
                  </div>
                  <div className="mt-4">
                    <CustomEditor onChange={setDescription} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

function UploadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20v-6M12 4v10M5 12l7-7 7 7" />
    </svg>
  );
}
