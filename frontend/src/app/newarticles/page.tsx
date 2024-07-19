"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Footer from "@/assets/footer";
import Header from "@/assets/header";
import CreateArticles from "@/assets/newarticle";
import { ArrowRightIcon } from "lucide-react";
import axios from "axios";

type Category = {
  id: number;
  name: string;
};
type Tag = {
  id: number;
  name: string;
};

export default function Newarticles() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [step, setStep] = useState<number>(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    const fetchCategoriesAndTags = async () => {
      try {
        const [categoriesResponse, tagsResponse] = await Promise.all([
          axios.get("https://blogchain.onrender.com/categories"),
          axios.get("https://blogchain.onrender.com/tags"),
        ]);
        setCategories(categoriesResponse.data);
        const filteredTags = tagsResponse.data.filter((tag: Tag) => tag.id <= 25);
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
      } else {
        return [...prevTags, tag];
      }
    });
  };

  const handleNextStep = () => {
    if (selectedCategory && selectedTags.length > 0) {
      setStep(2);
    } else {
      alert("Please select a category and at least one tag.");
    }
  };

  const handlePreviousStep = () => {
    setStep(1);
  };

  return (
    <div className="max-h-screen">
      <Header />
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 bg-gradientbg2 py-8 px-4 md:px-6 flex justify-center">
          <div className="w-full max-w-4xl">
            {step === 1 && (
              <div className="space-y-8">
                <div className="text-center">
                  <div className="text-black font-semibold text-xl">
                    Category
                  </div>
                  <div className="text-yellow-500 text-xl">Step 1</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant="outline"
                        className={`text-lg hover:bg-inherit rounded-full border-gray-500 w-full ${
                          selectedCategory === category
                            ? "bg-gray-300"
                            : ""
                        }`}
                        onClick={() => handleCategorySelect(category)}
                      >
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-black font-semibold text-xl">Tags</div>
                  <div className="text-yellow-500 text-xl">Step 2</div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {tags.map((tag) => (
                      <Button
                        key={tag.id}
                        variant="outline"
                        className={`text-lg hover:bg-inherit rounded-full border-gray-500 w-full ${
                          selectedTags.includes(tag) ? "bg-gray-300" : ""
                        }`}
                        onClick={() => handleTagSelect(tag)}
                      >
                        {tag.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <Button
                    variant="outline"
                    className="text-xl border-none bg-inherit hover:bg-inherit rounded-full hover:underline hover:underline-offset-4 hover:decoration-black"
                    onClick={handleNextStep}
                  >
                    Next
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            {step === 2 && (
              <CreateArticles
                onGoBack={handlePreviousStep}
                selectedCategory={selectedCategory}
                selectedTags={selectedTags}
              />
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
