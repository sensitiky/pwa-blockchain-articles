"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChangeEvent, JSX, SVGProps, useState } from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

interface CreateArticlesProps {
  onGoBack: () => void;
}

export default function CreateArticles({ onGoBack }: CreateArticlesProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

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

  return (
    <div className="text-foreground py-4">
      <header className="container mx-auto px-4 md:px-6 relative">
        <div className="absolute top-8 right-4 flex gap-4">
          <Button
            variant="outline"
            className="px-2 py-2 border-black hover:bg-yellow-500 text-md rounded-full border-[1px]"
          >
            Save Draft
          </Button>
          <Button
            variant="outline"
            className="px-2 py-2 text-md bg-customColor-innovatio2 border-black hover:bg-green-500 rounded-full border-[1px]"
          >
            Publish
          </Button>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-center">
            Create an Article
          </h1>
          <p className="text-muted-foreground md:text-xl text-center">
            Share your thoughts and ideas with the world.
          </p>
        </div>
        <div className="absolute top-8 left-4 flex gap-4">
          <button
            onClick={onGoBack}
            className="hover:underline hover:underline-offset-4 hover:decoration-black bg-inherit text-black inline-flex h-8 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors hover:bg-inherit focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Go Back
          </button>
        </div>
      </header>
      <main className="items-center container mx-auto px-4 pb-12 md:px-6 md:pb-16">
        <div className="grid gap-8 py-8">
          <div className="space-y-8">
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-2xl font-medium"
              >
                Title
              </label>
              <Input
                id="title"
                placeholder="Enter a title for your article"
                className="w-full"
              />
            </div>
            <div >
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
                  <div className="aspect-[16/9] w-full rounded-md flex items-center justify-center">
                    <UploadIcon className="mr-2 h-4 w-4" />
                    <span className="text-black">Upload</span>
                  </div>
                )}
                {!imageUrl && (
                  <label
                    htmlFor="image-upload"
                    className="absolute inset-0 flex items-baseline justify-center bg-black bg-opacity-50 cursor-pointer"
                  >
                    <input
                      id="image-upload"
                      type="file"
                      className="hidden rounded-lg"
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
                rows={50}
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
      </main>
    </div>
  );
}

function FacebookIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function TwitterIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

function UploadIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}

function XIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
