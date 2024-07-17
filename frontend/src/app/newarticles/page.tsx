"use client";

import { JSX, SVGProps, useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import Footer from "@/assets/footer";
import Header from "@/assets/header";
import CreateArticles from "@/assets/newarticle";
import { ArrowRightIcon } from "lucide-react";

export default function Newarticles() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [step, setStep] = useState<number>(1);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleTagSelect = (tag: string) => {
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
    <div className="max-h-lvh">
      <Header />
      <div className="flex flex-col min-h-dvh">
        <main className="flex-1 bg-gradientbg2 py-12 px-4 md:px-6 flex justify-center">
          <div className="w-full max-w-4xl">
            {step === 1 && (
              <div className="space-y-12">
                <div className="text-center">
                  <div className="text-black font-semibold">Category</div>
                  <div className="text-yellow-500">Step 1</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {["Analysis & Opinions", "Tutorial", "Review", "Case Study", "News & Updates", "Resources & Tools", "Interviews"].map((category) => (
                      <Button
                        key={category}
                        variant="outline"
                        className={`hover:bg-inherit rounded-none border-gray-500 border-r-0 border-l-0 w-40 mx-auto ${
                          selectedCategory === category ? "bg-gray-300" : ""
                        }`}
                        onClick={() => handleCategorySelect(category)}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-black font-semibold">Tags</div>
                  <div className="text-yellow-500">Step 2</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {[
                      "Blockchain",
                      "Cryptocurrency",
                      "DeFi",
                      "NFTs",
                      "Web3",
                      "Metaverse",
                    ].map((tag) => (
                      <Button
                        key={tag}
                        variant="outline"
                        className={`hover:bg-inherit rounded-full border-gray-500 w-auto ${
                          selectedTags.includes(tag) ? "bg-gray-300" : ""
                        }`}
                        onClick={() => handleTagSelect(tag)}
                      >
                        {tag}
                      </Button>
                    ))}
                  </div>  
                </div>
                <div className="flex justify-end mt-6 ">
                  <Button variant={"outline"} className="border-none bg-inherit hover:bg-inherit rounded-full hover:underline hover:underline-offset-4 hover:decoration-black"onClick={handleNextStep}>Next<ArrowRightIcon className="mr-2 h-4 w-4"/></Button>
                </div>
              </div>
            )}
            {step === 2 && (
              <CreateArticles onGoBack={handlePreviousStep} />
            )}
          </div>
        </main>
      </div>
      <Footer/>
    </div>
  );
}
