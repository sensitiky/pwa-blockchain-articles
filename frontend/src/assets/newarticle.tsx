"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChangeEvent, SVGProps, useState } from "react";
import { ArrowLeftIcon } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../context/authContext";

interface CreateArticlesProps {
  onGoBack: () => void;
}

export default function CreateArticles({ onGoBack }: CreateArticlesProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { user } = useAuth();

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

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("authorId", user.id); // Assuming user.id exists
    formData.append("publish", JSON.stringify(publish));

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await axios.post(
        "https://blogchain.onrender.com/auth/posts",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Post created successfully:", response.data);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="text-foreground py-4">
      <header className="container mx-auto px-4 md:px-6 relative">
        <div className="justify-start flex gap-4">
          <button
            onClick={onGoBack}
            className="hover:underline hover:underline-offset-4 hover:decoration-black bg-inherit text-black inline-flex h-8 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors hover:bg-inherit focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Go Back
          </button>
        </div>
        <div className="space-y-2 py-4">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-center">
            Create an Article
          </h1>
          <p className="text-muted-foreground md:text-xl text-center">
            Share your thoughts and ideas with the world.
          </p>
        </div>
      </header>
      <main className="container mx-auto px-4 pb-12 md:px-6 md:pb-16">
        <div className="grid gap-8">
          <div className="space-y-8">
            <div>
              <label
                htmlFor="title"
                className="py-2 block text-2xl font-medium"
              >
                Title
              </label>
              <Input
                id="title"
                placeholder="Enter a title for your article"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label
                htmlFor="banner-image"
                className="mb-2 block text-2xl font-medium"
              >
                Banner Image
              </label>
              <div className="relative">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Banner"
                    className="aspect-[16/9] w-full h-1/3 rounded-lg object-cover"
                  />
                ) : (
                  <div className="aspect-[16/9] w-full rounded-md flex items-center justify-center border-2 border-dashed border-gray-300 p-4">
                    <UploadIcon className="mr-2 h-6 w-6" />
                    <span className="text-gray-500">Upload</span>
                  </div>
                )}
                {!imageUrl && (
                  <label
                    htmlFor="image-upload"
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-pointer"
                  >
                    <input
                      id="image-upload"
                      type="file"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-2xl font-medium"
              >
                Description
              </label>
              <Textarea
                id="description"
                placeholder="Write a detailed description of your article"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={10}
                className="h-40 w-full resize-none text-lg"
              />
            </div>
            <div>
              <h3 className="mb-4 text-2xl font-medium">Add your social</h3>
              <div className="grid gap-4">
                <div className="flex items-center gap-4">
                  <FacebookIcon className="h-6 w-6" />
                  <Input
                    placeholder="Facebook URL"
                    className="flex-1 text-lg"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <TwitterIcon className="h-6 w-6" />
                  <Input placeholder="Twitter URL" className="flex-1 text-lg" />
                </div>
                <div className="flex items-center gap-4">
                  <LinkedinIcon className="h-6 w-6" />
                  <Input
                    placeholder="LinkedIn URL"
                    className="flex-1 text-lg"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <InstagramIcon className="h-6 w-6" />
                  <Input
                    placeholder="Instagram URL"
                    className="flex-1 text-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="justify-end py-4 flex gap-4">
          <Button
            variant="outline"
            className="px-2 py-2 border-black hover:bg-yellow-500 text-md rounded-full border-[1px]"
            onClick={() => handleSubmit(false)}
          >
            Save Draft
          </Button>
          <Button
            variant="outline"
            className="px-2 py-2 text-md bg-customColor-innovatio2 border-black hover:bg-green-500 rounded-full border-[1px]"
            onClick={() => handleSubmit(true)}
          >
            Publish
          </Button>
        </div>
      </main>
    </div>
  );
}

function UploadIcon(props: SVGProps<SVGSVGElement>) {
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

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M22 12C22 6.48 17.52 2 12 2S2 6.48 2 12c0 4.84 3.65 8.85 8.34 9.74V14.9h-2.51v-2.9h2.51V10.1c0-2.52 1.49-3.9 3.77-3.9 1.09 0 2.23.19 2.23.19v2.44h-1.26c-1.24 0-1.62.77-1.62 1.56v1.87h2.78l-.44 2.9h-2.34v6.84C18.35 20.85 22 16.84 22 12z" />
    </svg>
  );
}

function TwitterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M22.46 6.011c-.793.353-1.643.592-2.536.699a4.515 4.515 0 001.984-2.495 9.03 9.03 0 01-2.857 1.093 4.51 4.51 0 00-7.693 4.113 12.795 12.795 0 01-9.296-4.71 4.497 4.497 0 001.396 6.023 4.475 4.475 0 01-2.044-.566v.056a4.509 4.509 0 003.617 4.421 4.481 4.481 0 01-2.037.077 4.515 4.515 0 004.213 3.128 9.042 9.042 0 01-5.601 1.932c-.363 0-.72-.021-1.073-.063a12.79 12.79 0 006.923 2.027c8.307 0 12.847-6.879 12.847-12.847 0-.197-.005-.393-.014-.587a9.18 9.18 0 002.258-2.338z" />
    </svg>
  );
}

function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M21 2H3C2.447 2 2 2.447 2 3v18c0 .553.447 1 1 1h18c.553 0 1-.447 1-1V3c0-.553-.447-1-1-1zM8.357 19.708H5.579V9.372h2.778v10.336zM6.968 8.075a1.609 1.609 0 110-3.218 1.609 1.609 0 010 3.218zm12.738 11.633h-2.778v-5.306c0-1.266-.024-2.894-1.764-2.894-1.768 0-2.038 1.381-2.038 2.804v5.396H10.35V9.372h2.667v1.419h.037c.371-.703 1.276-1.445 2.625-1.445 2.806 0 3.322 1.847 3.322 4.248v6.114z" />
    </svg>
  );
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.332 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.332-3.608-1.308-.975-.975-1.246-2.242-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.246 3.608-1.308 1.266-.058 1.646-.07 4.85-.07m0-2.163C8.754 0 8.329.015 7.053.073c-1.731.08-3.264.643-4.488 1.867C1.343 3.164.78 4.697.7 6.428.642 7.704.627 8.129.627 12s.015 4.296.073 5.572c.08 1.731.643 3.264 1.867 4.488 1.224 1.224 2.757 1.787 4.488 1.867 1.276.058 1.701.073 5.572.073s4.296-.015 5.572-.073c1.731-.08 3.264-.643 4.488-1.867 1.224-1.224 1.787-2.757 1.867-4.488.058-1.276.073-1.701.073-5.572s-.015-4.296-.073-5.572c-.08-1.731-.643-3.264-1.867-4.488C19.697 1.343 18.164.78 16.428.7 15.152.642 14.727.627 12 .627zM12 5.838c-3.403 0-6.162 2.76-6.162 6.162S8.597 18.162 12 18.162 18.162 15.403 18.162 12 15.403 5.838 12 5.838zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 110-2.881 1.44 1.44 0 010 2.881z" />
    </svg>
  );
}
