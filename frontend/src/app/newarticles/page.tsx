"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { FaCheck } from 'react-icons/fa';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from 'next/image';
import { Separator } from "@/components/ui/separator";
import ImageUpload from "@/assets/imageupload";
import Upload from "@/assets/upload";

const categories = [
  "Educational",
  "Tutorial",
  "Review",
  "Case Study",
  "Experience",
  "Journalist Interview",
];

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const NewArticles: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isBlockchainSpecific, setIsBlockchainSpecific] = useState<boolean | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [inputTag, setInputTag] = useState("");
  const [user, setUser] = useState({
    name: "Pepito",
    profilePicture: "https://via.placeholder.com/150",
  });
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [socialLinks, setSocialLinks] = useState<{ platform: string; url: string; icon: string; checked: boolean; displayIcon: boolean }[]>([]);

  const router = useRouter();

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        setIsAuthenticated(true);
        try {
          const response = await fetch("http://localhost:4000/users/session", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData.user);
          } else {
            console.error("Failed to fetch user data");
            localStorage.removeItem("token");
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        }
      }
      setAuthChecked(true);
    };

    verifyAuth();
  }, []);

  useEffect(() => {
    if (authChecked && !isAuthenticated) {
      router.push("/authentication");
    }
  }, [authChecked, isAuthenticated, router]);

  const handleAddTag = () => {
    if (inputTag && !tags.includes(inputTag)) {
      setTags([...tags, inputTag]);
      setInputTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handlePublish = async () => {
    if (!selectedCategory || isBlockchainSpecific === null || !title || !story) {
      setFeedbackMessage("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/users/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          category: selectedCategory,
          isBlockchainSpecific,
          tags,
          title,
          story,
          bannerImage,
          socialLinks,
        }),
      });

      if (response.ok) {
        setFeedbackMessage("Article published successfully!");
        // Clear form
        setSelectedCategory(null);
        setIsBlockchainSpecific(null);
        setTags([]);
        setTitle("");
        setStory("");
        setBannerImage(null);
        setSocialLinks([]);
      } else {
        setFeedbackMessage("Failed to publish article. Please try again.");
      }
    } catch (error) {
      setFeedbackMessage("An error occurred. Please try again.");
    }
  };

  const handleStartNewCampaign = () => {
    if (!isAuthenticated) {
      router.push("/authentication");
    } else {
      router.push("/new-campaign");
    }
  };

  const handleAddSocialLink = () => {
    setSocialLinks([...socialLinks, { platform: "", url: "", icon: "", checked: false, displayIcon: false }]);
  };

  const handleRemoveSocialLink = (index: number) => {
    const newLinks = [...socialLinks];
    newLinks.splice(index, 1);
    setSocialLinks(newLinks);
  };

  const handleIconFetch = async (url: string): Promise<string> => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}`;
    } catch (error) {
      console.error("Invalid URL:", error);
      return 'https://via.placeholder.com/16';
    }
  };

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter') {
      const newLinks = [...socialLinks];
      newLinks[index].displayIcon = true;
      setSocialLinks(newLinks);
    }
  };

  const handleCheckboxChange = async (index: number) => {
    const newLinks = [...socialLinks];
    newLinks[index].displayIcon = !newLinks[index].displayIcon;
    if (newLinks[index].displayIcon && !newLinks[index].icon) {
      newLinks[index].icon = await handleIconFetch(newLinks[index].url);
    }
    setSocialLinks(newLinks);
  };

  if (!authChecked) {
    return null;
  }
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="bg-header">
        <div className="bg-customColor-header lg:hidden flex items-center justify-between px-4 lg:px-6 h-14 border-b bg-header ">
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger>
                <button className="focus:outline-none">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="white"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16m-7 6h7"
                    ></path>
                  </svg>
                </button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Blogchain</SheetTitle>
                  <SheetDescription>Welcome to Blogchain!</SheetDescription>
                </SheetHeader>
                <nav className="flex flex-col gap-8">
                  <Link
                    href="#"
                    className="text-sm font-medium hover:underline underline-offset-4"
                    prefetch={false}
                  >
                    How it works
                  </Link>
                  <Link
                    href="#"
                    className="text-sm font-medium hover:underline underline-offset-4"
                    prefetch={false}
                  >
                    About us
                  </Link>
                  <Link
                    href="#"
                    className="text-sm font-medium hover:underline underline-offset-4"
                    prefetch={false}
                  >
                    Help with the Campaign
                  </Link>
                  <div className="flex justify-center">
                    <Link href="/authentication">
                      <Button
                        variant="outline"
                        className="bg-customColor-innovatio2 rounded-full px-4 py-2 text-sm font-medium "
                      >
                        Get Started
                      </Button>
                    </Link>
                  </div>
                  <div className="flex justify-center">
                    <Button className="bg-customColor-innovatio3 rounded-full px-4 py-2 text-sm font-medium">
                      Connect Wallet
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
          <div>
            <Link href="/">
              <img src="/Logo.svg" alt="Logo" className="h-8 filter invert" />
            </Link>
          </div>
        </div>

        <header className="bg-customColor-header p-4 hidden lg:block">
          <div className="container mx-auto flex justify-between items-center">
            <div className="text-white text-lg font-semibold">
              <Link href="/">Blogchain</Link>
            </div>
            <div className="relative text-gray-400 focus-within:text-gray-600">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                  <path d="M12.9 14.32l4.1 4.1-1.4 1.4-4.1-4.1c-1 .7-2.2 1.1-3.5 1.1C4.9 16.82 2 13.92 2 10.42S4.9 4 8.4 4s6.4 2.9 6.4 6.4c0 1.3-.4 2.5-1.1 3.5zM8.4 14c2 0 3.6-1.6 3.6-3.6S10.4 6.8 8.4 6.8 4.8 8.4 4.8 10.4s1.6 3.6 3.6 3.6z" />
                </svg>
              </span>
              <Input
                type="search"
                className="py-2 text-sm text-customColor-innovatio3 bg-dark-blue rounded-full pl-10 focus:outline-none focus:bg-white focus:text-gray-300"
                placeholder="Search..."
              />
            </div>
            <nav className="space-x-4 flex items-center">
              <Link href="/about-us" className="text-white ">
                About Us
              </Link>
              <Link href="/support-us" className="text-white ">
                Support Us
              </Link>
              <Link href="/articles" className="text-white ">
                Articles
              </Link>
              <Link href="/tops" className="text-white ">
                Tops
              </Link>
              {isAuthenticated ? (
                <Avatar className="rounded-full">
                  {" "}
                  <AvatarImage src={user.profilePicture} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              ) : (
                <Button
                  className="rounded-full bg-customColor-innovatio text-customColor-innovatio3  hover:text-white"
                  onClick={handleStartNewCampaign}
                >
                  Get Started
                </Button>
              )}
            </nav>
          </div>
        </header>
      </div>

      <div className="flex flex-col md:flex-row items-start justify-center px-6 py-8 space-y-8 md:space-x-8">
        <div className="flex flex-col space-y-6 w-full md:w-1/3">
          <Card className="p-4 shadow-none border-0">
            <CardHeader>
              <CardTitle>
                Step 1{" "}
                <span className="text-customColor-letras">Select Category</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    className={`px-6 py-2 border rounded-full transition ${
                      selectedCategory === category
                        ? "bg-gray-300"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
              {selectedCategory && (
                <div className="mt-4">
                  <p>Your Selection</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-4 py-2 border rounded-full bg-black text-white">
                      {selectedCategory}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6 cursor-pointer text-red-500"
                      onClick={() => setSelectedCategory(null)}
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.225 5.225a.75.75 0 011.06 0L12 9.94l4.715-4.715a.75.75 0 111.06 1.06L13.06 11l4.715 4.715a.75.75 0 11-1.06 1.06L12 12.06l-4.715 4.715a.75.75 0 01-1.06-1.06L10.94 11 6.225 6.285a.75.75 0 010-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="mt-4">You selected "{selectedCategory}":</p>
                  <p className="text-gray-600">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <button
                className="px-6 py-2 bg-customColor-innovatio3 text-white rounded-full hover:bg-green-600 transition"
                onClick={handlePublish}
              >
                Continue
              </button>
            </CardFooter>
          </Card>

          <Card className="p-4 border-0 shadow-none">
            <CardHeader>
              <CardTitle>
                Step 2{" "}
                <span className="text-customColor-letras">
                  Select your Tags
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex space-x-2 items-center">
                  <span>Are you talking about a specific blockchain?</span>
                  <button
                    className={`px-4 py-2 border rounded-full transition ${
                      isBlockchainSpecific === true
                        ? "bg-gray-300"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                    onClick={() => setIsBlockchainSpecific(true)}
                  >
                    Yes
                  </button>
                  <button
                    className={`px-4 py-2 border rounded-full transition ${
                      isBlockchainSpecific === false
                        ? "bg-gray-300"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                    onClick={() => setIsBlockchainSpecific(false)}
                  >
                    No
                  </button>
                </div>
                {isBlockchainSpecific && (
                  <div className="flex items-center gap-2">
                    <Input
                      id="tag"
                      type="text"
                      placeholder="Who or what?"
                      className="border border-gray-300 p-4 w-full rounded-xl"
                      value={inputTag}
                      onChange={(e) => setInputTag(e.target.value)}
                    />
                    <button
                      className="px-4 py-2 bg-white text-green-500 rounded-md border-2"
                      onClick={handleAddTag}
                    >
                      +
                    </button>
                  </div>
                )}
                <div>
                  <p>Your Tags</p>
                  <div className="flex flex-wrap gap-4 mt-2">
                    {tags.map((tag) => (
                      <div key={tag} className="flex items-center gap-2">
                        <span className="px-4 py-2 border rounded-full bg-black text-white">
                          {tag}
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-6 h-6 cursor-pointer text-red-500"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          <path
                            fillRule="evenodd"
                            d="M6.225 5.225a.75.75 0 011.06 0L12 9.94l4.715-4.715a.75.75 0 111.06 1.06L13.06 11l4.715 4.715a.75.75 0 11-1.06 1.06L12 12.06l-4.715 4.715a.75.75 0 01-1.06-1.06L10.94 11 6.225 6.285a.75.75 0 010-1.06z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator
          orientation="vertical"
          className="hidden lg:block bg-gray-400 w-[1px] min-h-screen"
        />

        <div className="flex flex-col space-y-6 w-full md:w-2/3">
          {bannerImage && (
            <div className="w-full h-64 relative">
              <Image
                src={bannerImage}
                alt="Banner Image"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
              <button
                className="absolute top-2 right-2 p-1 bg-transparent text-white rounded-full"
                onClick={() => setBannerImage(null)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 cursor-pointer text-red-500"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.225 5.225a.75.75 0 011.06 0L12 9.94l4.715-4.715a.75.75 0 111.06 1.06L13.06 11l4.715 4.715a.75.75 0 11-1.06 1.06L12 12.06l-4.715 4.715a.75.75 0 01-1.06-1.06L10.94 11 6.225 6.285a.75.75 0 010-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}

          <Card className="p-4 border-0 shadow-none">
            <CardHeader>
              <CardTitle>Title</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                id="title"
                type="text"
                placeholder="Title"
                className="border border-gray-300 p-4 w-full rounded-xl"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </CardContent>
          </Card>

          <ImageUpload setImage={setBannerImage} />

          <Card className="p-4 shadow-none border-0">
            <CardHeader>
              <CardTitle>Introduce your description</CardTitle>
            </CardHeader>
            <CardContent>
              <ReactQuill value={story} onChange={setStory} />
              <Upload />
            </CardContent>
            <CardFooter>
              <button
                className="px-6 py-2 bg-customColor-innovatio3 text-white rounded-md hover:bg-green-600 transition"
                onClick={handlePublish}
              >
                Publish
              </button>
            </CardFooter>
          </Card>

          <Card className="p-4 shadow-none border-0">
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {socialLinks.map((link, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-2 mb-2 flex-wrap"
                >
                  {link.displayIcon ? (
                    <img
                      src={link.icon || "https://via.placeholder.com/16"}
                      alt="icon"
                      className="w-4 h-4"
                    />
                  ) : (
                    <input
                      type="checkbox"
                      checked={link.checked}
                      onChange={() => handleCheckboxChange(index)}
                      className="mr-2"
                    />
                  )}
                  {link.displayIcon ? (
                    <>
                      <span>{link.platform}</span>
                      <span>{link.url}</span>
                    </>
                  ) : (
                    <>
                      <Input
                        type="text"
                        placeholder="Platform"
                        value={link.platform}
                        onChange={(e) => {
                          const newLinks = [...socialLinks];
                          newLinks[index].platform = e.target.value;
                          setSocialLinks(newLinks);
                        }}
                        className="flex-1"
                        onKeyPress={(e) => handleInputKeyPress(e, index)}
                      />
                      <Input
                        type="text"
                        placeholder="URL"
                        value={link.url}
                        onChange={async (e) => {
                          const newLinks = [...socialLinks];
                          newLinks[index].url = e.target.value;
                          if (link.displayIcon) {
                            newLinks[index].icon = await handleIconFetch(
                              e.target.value
                            );
                          }
                          setSocialLinks(newLinks);
                        }}
                        className="flex-1"
                        onKeyPress={(e) => handleInputKeyPress(e, index)}
                      />
                    </>
                  )}
                  <button
                    className="p-1 bg-white text-red-600 rounded-full"
                    onClick={() => handleRemoveSocialLink(index)}
                  >
                    X
                  </button>
                  <FaCheck className="w-4 h-4 text-green-500 ml-2" />
                </div>
              ))}
              <button
                className="px-4 py-2 bg-customColor-innovatio3 text-white rounded-md hover:bg-green-600 transition"
                onClick={handleAddSocialLink}
              >
                Add Social Link
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
      {feedbackMessage && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-md">
          {feedbackMessage}
        </div>
      )}
      <footer className="py-6 border-t bg-customColor-header border-gray-300 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Image
                src="/Logo.svg"
                alt="Innovatio logo"
                width={200}
                height={24}
                className="mb-4 filter invert"
              />
              <p className="text-gray-400 text-sm">
                Help different crowdfunding <br />
                campaigns become a reality
                <br />
                thanks to your contributions,
                <br /> invest in projects,
                <br /> fund purposes and get rewards.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-300 text-lg mb-4">
                How it works
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:underline text-gray-400">
                    Campaign Flow
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline text-gray-400">
                    Investment Flow
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline text-gray-400">
                    Milestones & Control
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline text-gray-400">
                    Q & A
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-300 text-lg mb-4">
                About us
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:underline text-gray-400">
                    Introduction
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline text-gray-400">
                    Team & Members
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline text-gray-400">
                    Discord Community
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline text-gray-400">
                    Social Media
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-300 text-lg mb-4">
                Help with the Campaigns
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:underline text-gray-400">
                    Ideas of Campaign
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline text-gray-400">
                    Tokenomics
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline text-gray-400">
                    Digital Marketing Strategy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline text-gray-400">
                    Contact our team
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 flex justify-center space-x-6">
            <Link href="#" className="text-gray-500 hover:text-gray-300">
              <Image
                src="/discord.svg"
                alt="discord"
                width={24}
                height={24}
                className="filter invert"
              />
            </Link>
            <Link href="#" className="text-gray-500 hover:text-gray-300">
              <Image
                src="/twitter.svg"
                alt="twitter"
                width={24}
                height={24}
                className="filter invert"
              />
            </Link>
            <Link href="#" className="text-gray-500 hover:text-gray-300">
              <Image
                src="/instagram.svg"
                alt="instagram"
                width={24}
                height={24}
                className="filter invert"
              />
            </Link>
            <Link href="#" className="text-gray-500 hover:text-gray-300">
              <Image
                src="/facebook.svg"
                alt="facebook"
                width={24}
                height={24}
                className="filter invert"
              />
            </Link>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-4 flex justify-center text-gray-300 text-sm">
            <p>&copy; 2024 Innovatio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NewArticles;
